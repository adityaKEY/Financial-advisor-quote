const { client } = require("../config/db");

const getLeadInfo = async (idlead, identity) => {
  try {
    let query = `
        SELECT 
        e.firstname, 
        e.lastname, 
        e.middlename, 
        ec.contact_value, 
        cm.meta_data_name AS gender
        FROM 
        oppurtunity.lead l
        JOIN 
        core.entity e ON l.identity_oppurtunity = e.identity
        JOIN 
        core.cr_metadata cm ON e.idmeta_data_gender = cm.idmetadata 
        JOIN 
        core.entity_contact ec ON e.identity = ec.identity
        WHERE 
        l.idlead = $1  -- Replace :leadId with the actual leadId value you are searching for
        and l.identity_lead_createdby  = $2
        AND ec.idmeta_contact_type = 'eef8f47d787041b59afd37937deed705';
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
