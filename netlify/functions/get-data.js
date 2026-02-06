const axios = require('axios');

exports.handler = async (event, context) => {
    try {
          const { AIRTABLE_PAT, BASE_ID } = process.env;

      if (!AIRTABLE_PAT || !BASE_ID) {
              return {
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Missing environment variables' })
              };
      }

      const response = await axios.get(
              `https://api.airtable.com/v0/${BASE_ID}/Leads`,
        {
                  headers: {
                              'Authorization': `Bearer ${AIRTABLE_PAT}`,
                              'Content-Type': 'application/json'
                  }
        }
            );

      return {
              statusCode: 200,
              headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(response.data)
      };
    } catch (error) {
          console.error('Error fetching data:', error);
          return {
                  statusCode: 500,
                  body: JSON.stringify({ 
                                               error: error.message,
                            details: error.response?.data || 'Unknown error'
                  })
          };
    }
};
