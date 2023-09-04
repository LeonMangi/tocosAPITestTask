describe('/users', () => {
    it('Create a new user', () => {
        // Define the API endpoint and user data
        const apiUrl = 'https://api.example.com/users'
        const userData = {
            userID: 'new_user',
            email: 'new_user@example.com',
            wallet_ID: 'wallet_ID'
        };

        // Send a POST request to create a new user
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ({access_token})'
            },
            body: userData,
        }).then((response) => {
            // Check the response status code
            expect(response.status).to.equal(201)
            expect(response.body.name).to.equal('new_user')
            expect(response.body.email).to.equal('new_user@example.com')
            expect(response.body.password).to.equal('wallet_ID')

            // Check the response body for user data
            cy.log('User creation response:', response.body)
        })
    })

    it('Create a new User with empty data', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/users'

        // Send a POST request with empty user data
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ({access_token})'
            },
            body: {},
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code is not 201
            expect(response.status).not.to.equal(201)

            // Log the response to the Cypress command log
            cy.log('Failed user creation response:', response.body)
        })
    })

    it('should fail to create a new user with wrong authorization', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/users'

        // Send a POST request with a malformed or wrong authorization token
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {malformed_access_token}',
            },
            body: {},
            failOnStatusCode: false, // Allow the request to fail
        }).then((response) => {
            // Check that the response status code is not 201
            expect(response.status).not.to.equal(201)

            // Log the response to the Cypress command log
            cy.log('Failed user creation response:', response.body)
        })
    })

    it('should create a new user with wrong/malformed data', () => {
        // Define the API endpoint and user data with wrong/malformed values
        const apiUrl = 'https://api.example.com/users'
        const userData = {
            userID: '!!!!', 
            email: 'new_user.com', 
            wallet_ID: '234',
        };

        // Send a POST request to create a new user with wrong/malformed data
        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}',
            },
            body: userData,
        }).then((response) => {
            // Check that the response status code is not 201
            expect(response.status).not.to.equal(201);

            // Log the response to the Cypress command log
            cy.log('Failed user creation response:', response.body);
        });
    });

    it('Create a new user with network throttling', () => {
        // Define the API endpoint
        const apiUrl = 'https://api.example.com/users'
        const userData = {
            userID: 'new_user',
            email: 'new_user@example.com',
            wallet_ID: 'wallet_ID'
        }

        // Use cy.route() to intercept the API request and delay its response
        cy.server()

        // Set up the route to intercept the POST request to the API endpoint
        cy.route({
            method: 'POST',
            url: apiUrl,
            response: userData, // Mock the response with user data
            delay: 2000 // Delay the response by 2 seconds (simulating network throttling)
        }).as('createUser')

        cy.request({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {access_token}'
            },
            body: userData
        })

        // Wait for the intercepted request to complete
        cy.wait('@createUser').then((xhr) => {
            expect(xhr.status).to.equal(201)
            expect(xhr.response.body.userID).to.equal('new_user')
            expect(xhr.response.body.email).to.equal('new_user@example.com')
            expect(xhr.response.body.wallet_ID).to.equal('wallet_ID')

            cy.log('User creation response:', xhr.response.body)
        })
    })
})
