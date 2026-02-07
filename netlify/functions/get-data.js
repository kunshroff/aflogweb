const https = require('https');

exports.handler = async (event, context) => {
      try {
              const { AIRTABLE_PAT, BASE_ID } = process.env;

        if (!AIRTABLE_PAT || !BASE_ID) {
                  return {
                              statusCode: 500,
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ error: 'Missing environment variables' })
                  };
        }

        return new Promise((resolve, reject) => {
                  const options = {
                              hostname: 'api.airtable.com',
                              path: `/v0/${BASE_ID}/Leads`,
                              method: 'GET',
                              headers: {
                                            'Authorization': `Bearer ${AIRTABLE_PAT}`,
                                            'Content-Type': 'application/json'
                              }
                  };

                                 const req = https.request(options, (res) => {
                                             let data = '';
                                             res.on('data', (chunk) => { data += chunk; });
                                             res.on('end', () => {
                                                               try {
                                                                                   // Only parse if status is 200
                                                                                   if (res.statusCode === 200) {
                                                                                                         JSON.parse(data); // Validate JSON
                                                                                         }
                                                                                   resolve({
                                                                                                         statusCode: res.statusCode,
                                                                                                         headers: {
                                                                                                                                 'Content-Type': 'application/json',
                                                                                                                                 'Access-Control-Allow-Origin': '*'
                                                                                                               },
                                                                                                         body: data
                                                                                         });
                                                               } catch (parseError) {
                                                                                   resolve({
                                                                                                         statusCode: 500,
                                                                                                         headers: { 'Content-Type': 'application/json' },
                                                                                                         body: JSON.stringify({ error: 'Invalid JSON response from Airtable' })
                                                                                         });
                                                               }
                                             });
                                 });

                                 req.on('error', (error) => {
                                             resolve({
                                                           statusCode: 500,
                                                           headers: { 'Content-Type': 'application/json' },
                                                           body: JSON.stringify({ error: error.message })
                                             });
                                 });

                                 req.end();
        });
      } catch (error) {
              return {
                        statusCode: 500,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: error.message })
              };
      }
};
