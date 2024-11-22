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
        if(index != metaMasters.length - 1){
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


  module.exports = {
    getMetaData
  };
  