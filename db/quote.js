const { client } = require("../config/db");

const getMetaData = async (metaMasters) => {
  try {
    let query = `
      SELECT 
      qm.idmetadata, qm.meta_data_name, qm.idmetamaster, qm2.meta_master_name 
      FROM quote.qq_metadata qm 
      INNER JOIN quote.qq_metamaster qm2 
      ON qm.idmetamaster = qm2.idmetamaster 
      WHERE qm.idmetamaster IN (`;

    metaMasters.forEach((master, index) => {
      query += `$${index + 1}`;
      if (index != metaMasters.length - 1) {
        query += ', ';
      }
    });

    query += `);`
    const res = await client.query(query, metaMasters);
    return res.rows;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};


const getEntityIdentity = async (leadId) => {
  try {
    const query = `
      SELECT 
      identity_oppurtunity 
      FROM oppurtunity.lead
      WHERE idlead = $1`;
      
    const res = await client.query(query, [leadId]);
    return res.rows[0].identity_oppurtunity;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}


const updateEntityDobByIdentity = async (identity, dob) => {
  try {
    const query = `
    UPDATE core.entity 
    SET dob = $1
    WHERE identity = $2
    RETURNING *`;

    const res = await client.query(query, [dob, identity]);
    return res.rows;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}

const createQuote = async (values) => {
  try {
    const query = `
    INSERT INTO quote.quote (
    "quote_identity",
    "quick_quote_id", 
    "dob", 
    "product_name",
    "leadid", 
    "nationality", 
    "residential_status", 
    "smoker", 
    "occupation", 
    "educational_background", 
    "annual_income", 
    "coverage_amount", 
    "cover_till_age", 
    "premium_payment_term", 
    "payment_type", 
    "base_premium", 
    "add_on_rider_amt", 
    "total_premium"
    )
    VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    )
    RETURNING *`;

    const valuesArr = [
      values.quote_identity,
      values.quick_quote_id, 
      values.dob, 
      values.product_name,
      values.leadid, 
      values.nationality, 
      values.residential_status, 
      values.smoker, 
      values.occupation, 
      values.educational_background, 
      values.annual_income, 
      values.coverage_amount, 
      values.cover_till_age, 
      values.premium_payment_term, 
      values.payment_type, 
      values.base_premium, 
      values.add_on_rider_amt, 
      values.total_premium
    ]

    const res = await client.query(query, valuesArr);
    return res.rows;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
}


  module.exports = {
    getMetaData,
    getEntityIdentity,
    updateEntityDobByIdentity,
    createQuote
  };
