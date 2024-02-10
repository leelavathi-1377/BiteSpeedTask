const Sequelize = require('sequelize');
const db = require("../models/connect");
const Contact = require("../models/Contact");
const contactdbModel = Contact(db, Sequelize);

const getContactDetails = async (content) => {
    try {
        const queryCondition = {
            where: {
                [Sequelize.Op.or]: [
                    { email: content.email },
                    { phonenumber: content.phoneNumber }
                ]
            },
            order: [['createdat', 'ASC']]
        };
        const contacts = await contactdbModel.findAll(queryCondition);
        return contacts.map(contact => contact.toJSON());
    } catch (error) {
        console.error('Error retrieving contact details:', error);
        throw error;
    }
};

const updateContactDetails = async () => {
    try {
        await contactdbModel.update(
            { linkprecedence: 'secondary' },
            { where: { linkedid: { [Sequelize.Op.ne]: null } } }
        );
        console.log('Contacts updated to secondary successfully.');
    } catch (error) {
        console.error('Error updating contacts to secondary:', error);
        throw error;
    }
};

module.exports.identifyContact = async (req, res) => {
    const content = req.body;

    try {
        let contactDetails = await getContactDetails(content);

        if (contactDetails.length > 0) {
            await contactdbModel.create({
                email: content.email,
                phonenumber: content.phoneNumber,
                linkedid: contactDetails[0].id,
                linkprecedence: 'secondary',
            });

            await updateContactDetails();
            contactDetails = await getContactDetails(content)
            console.log(contactDetails)
            const primaryContact = contactDetails.find(contact => contact.linkprecedence === 'primary');
            console.log(primaryContact)
            

            const responseData = {
                contact: {
                    primaryContatctId: primaryContact ? primaryContact.id : null,
                    emails: [...new Set(contactDetails.map(contact => contact.email))],
                    phoneNumbers: [...new Set(contactDetails.map(contact => contact.phonenumber))],
                    secondaryContactIds: contactDetails
                        .filter(contact => contact.linkprecedence !== 'primary')
                        .map(contact => contact.id)
                }
            };

            return res.status(200).json(responseData);
        } else {
            const newPrimaryContact = await contactdbModel.create({
                email: content.email,
                phonenumber: content.phoneNumber,
                linkprecedence: 'primary',
            });

            return res.status(200).json({
                primaryContactId: newPrimaryContact.id,
                secondaryContactIds: [],
            });
        }
    } catch (error) {
        console.error('Error identifying contact:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
