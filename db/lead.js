const { client } = require("../config/db");

const getLeadInfo = async (idlead, identity) => {
  try {
    let query = `
    SELECT 
    COALESCE(e.firstname, '') AS firstname, 
    COALESCE(e.lastname, '') AS lastname, 
    COALESCE(e.middlename, '') AS middlename, 
    COALESCE(ec_phone.contact_value, '') AS phone, 
    COALESCE(cm.meta_data_name, '') AS gender,
    COALESCE(ec_email.contact_value, '') AS email
    FROM 
    oppurtunity.lead l
    JOIN 
    core.entity e ON l.identity_oppurtunity = e.identity
    LEFT JOIN 
    core.cr_metadata cm ON e.idmeta_data_gender = cm.idmetadata
    LEFT JOIN 
    core.entity_contact ec_phone ON e.identity = ec_phone.identity AND ec_phone.idmeta_contact_type = 'eef8f47d787041b59afd37937deed705'  -- For phone number
    LEFT JOIN 
    core.entity_contact ec_email ON e.identity = ec_email.identity AND ec_email.idmeta_contact_type = '4678e1bb1f2d414393a85dfbe0c85fff'  -- For email
    WHERE 
    l.idlead = $1  -- Replace :leadId with the actual leadId value you are searching for
    AND l.identity_lead_createdby = $2;
    `;
    const res = await client.query(query, [idlead, identity]);
    return res.rows;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

module.exports = {
  getLeadInfo,
};
