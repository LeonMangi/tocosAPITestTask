describe('/sell', () => {
    it('Sell Tocos', () => {
        // Define the API endpoint and sell data
        const apiUrl = 'https://api.example.com/sell'
        const sellData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'wallet_ID',
        };

        // Send a POST request to sell an item
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: sellData,
        }).then((response) => {
            // Check the response status code (assuming 200 indicates a successful sell)
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Tocos sold successfully')

            // Log the response to the Cypress command log
            cy.log('Sell item response:', response.body)
        })
    })

    it('Sell Tocos from an empty wallet', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/sell'

        // Define sell data with quantity set to 0
        const sellData = {
            itemId: 'item123',
            quantity: 0, // Set the quantity to 0
            paymentMethod: 'wallet_ID',
        };

        // Send a POST request to sell an item with quantity 0
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: sellData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400)
            expect(response.body.error).to.equal('Invalid request')

            // Log the response to the Cypress command log
            cy.log('Failed sell item response:', response.body)
        })
    })

    it('Sell float type Tocos (very small amount)', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/sell'

        // Define sell data with a small quantity (less than 1)
        const sellData = {
            itemId: 'item123',
            quantity: 0.5, // Set the quantity to a small value (e.g., 0.5)
            paymentMethod: 'wallet_ID',
        };

        // Send a POST request to sell an item with a small quantity
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: sellData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400)
            expect(response.body.error).to.equal('Quantity must be at least 1')

            // Log the response to the Cypress command log
            cy.log('Failed sell item response:', response.body)
        })
    })

    it('Sell Tocos with the wrong/malformed data', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/sell'

        // Define malformed sell data
        const malformedSellData = {
            itemId: '@@@@@',
            quantity: 'abc',
            paymentMethod: 'wallet_ID',
        };

        // Send a POST request to sell an item with malformed data
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: malformedSellData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400);
            expect(response.body.error).to.equal('Invalid request')

            // Log the response to the Cypress command log
            cy.log('Failed sell item response:', response.body)
        })
    })

    it('Sell Tocos with wrong/malformed authorization', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/sell'

        // Define sell data
        const sellData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'wallet_ID',
        };

        // Send a POST request to sell an item with malformed authorization
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {malformed_access_token}',
            },
            body: sellData,
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code indicates a failure (e.g., 4xx or 5xx)
            expect(response.status).to.be.at.least(400);
            expect(response.body.error).to.equal('Authorization failed')

            // Log the response to the Cypress command log
            cy.log('Failed sell item response:', response.body)
        })
    })

    it('should sell Tocos on a throttled network', () => {
        // Define the API endpoint and sell data
        const apiUrl = 'https://api.example.com/sell'
        const sellData = {
            itemId: 'Tocos',
            quantity: 200,
            paymentMethod: 'wallet_ID',
        };

        // Simulate a throttled network with a delay
        cy.intercept('POST', apiUrl, (req) => {
            req.delay(2000); // Delay the request by 2000 milliseconds (2 seconds)
        }).as('sellRequest');

        // Send a POST request to sell Tocos with throttled network
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: sellData,
        });

        // Wait for the request to complete (or a response) with a maximum timeout
        cy.wait('@sellRequest', { timeout: 5000 }).then((interception) => {
            // Check the response status code (assuming 200 indicates a successful sell)
            expect(interception.response.status).to.equal(200);
            expect(interception.response.body.message).to.equal('Tocos sold successfully')

            // Log the response to the Cypress command log
            cy.log('Sell item response:', interception.response.body)
        })
    })
})