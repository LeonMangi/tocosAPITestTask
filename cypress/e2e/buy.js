describe('/buy', () => {
    it('Buy Tocos with Credit Card (top up account)', () => {
        // Define the API endpoint and buy data
        const apiUrl = 'https://api.example.com/buy'
        const buyData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'creditCard', // Specify payment method as "creditCard"
        }

        // Send a POST request to buy Toco
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: buyData,
        }).then((response) => {
            // Check the response status code (assuming 200 indicates a successful buy)
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Item purchased successfully');

            // Log the response to the Cypress command log
            cy.log('Buy item response:', response.body)
        })
    })

    it('Buy Tocos above wallet limit', () => {
        // Define the API endpoint and buy data
        const apiUrl = 'https://api.example.com/buy'
        const buyData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'creditCard' // Specify payment method as "creditCard"
        }

        // Send a GET request to check the available quantity of the item
        cy.request({
            method: 'GET',
            url: `https://api.example.com/items/${buyData.itemId}`, // Assuming an API endpoint to check item details
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}'
            }
        }).then((itemResponse) => {
            // Check if the requested quantity is available or within a limit
            const availableQuantity = itemResponse.body.quantity
            expect(buyData.quantity).to.be.at.most(availableQuantity) // Check if the requested quantity is less than or equal to the available quantity

            // If the requested quantity is within the limit, proceed to make the purchase
            if (buyData.quantity <= availableQuantity) {
                cy.request({
                    method: 'POST',
                    url: apiUrl,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer {access_token}'
                    },
                    body: buyData
                }).then((response) => {
                    // Check the response status code (assuming 200 indicates a successful buy)
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Item purchased successfully')

                    // Log the response to the Cypress command log
                    cy.log('Buy item response:', response.body)
                })
            } else {
                // Log a message indicating that the requested quantity exceeds the available quantity
                cy.log('Requested quantity exceeds available quantity')
            }
        })
    })

    it('Buy Tocos with empty data', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/buy'

        // Define empty buy data
        const emptyBuyData = {}

        // Send a POST request to buy Toco with empty data
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: emptyBuyData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400);
            expect(response.body.error).to.equal('Invalid request')

            // Log the response to the Cypress command log
            cy.log('Failed buy item response:', response.body)
        })
    })

    it('Buy Tocos with wrong/malformed data', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/buy'

        // Define malformed buy data
        const malformedBuyData = {
            itemId: '@@@@@',
            quantity: 'abc',
            paymentMethod: 'creditCard',
        };

        // Send a POST request to buy Toco with malformed data
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: malformedBuyData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400)
            expect(response.body.error).to.equal('Invalid request');

            // Log the response to the Cypress command log
            cy.log('Failed buy item response:', response.body);
        })
    })

    it('Buy Tocos with wrong/malformed authorization', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/buy'

        const malformedBuyData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'creditCard',
        };

        // Send a POST request to buy Toco with malformed data and incorrect authorization
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {malformed_access_token}',
            },
            body: malformedBuyData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400)
            expect(response.body.error).to.equal('Authorization failed');

            // Log the response to the Cypress command log 
            cy.log('Failed buy item response:', response.body)
        })
    })

    it('Buy Tocos with throttled network', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/buy'
        const buyData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'creditCard', // Specify payment method as "creditCard"
        };

        // Simulate a throttled network with a delay
        cy.intercept('POST', apiUrl, (req) => {
            req.delay(2000); // Delay the request by 2000 milliseconds (2 seconds)
        }).as('buyRequest');

        // Send a POST request to buy Toco with throttled network
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: buyData,
        });

        // Wait for the request to complete (or a response) with a maximum timeout
        cy.wait('@buyRequest', { timeout: 5000 }).then((interception) => {
            // Check the response status code (assuming 200 indicates a successful buy)
            expect(interception.response.status).to.equal(200)
            expect(interception.response.body.message).to.equal('Item purchased successfully');

            // Log the response to the Cypress command log
            cy.log('Buy item response:', interception.response.body)
        })
    })
})