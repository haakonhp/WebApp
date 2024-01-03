import { toast } from "react-toastify";

describe('Dashboard Page Tests', () => {   
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

 
    describe('Dashboard Tests', () => {
        it('displays the Dashboard heading', () => {
            cy.get('h2').contains('Dashboard').should('exist');
        });

        it('has functional buttons for new tasks', () => {
            const buttons = ['Ny treningsmal', 'Nye spørsmål', 'Ny utøver'];
            buttons.forEach(btn => {
                cy.get('button').contains(btn).should('exist').and('be.visible');
            });
        });
    });

    describe('Utøvere Section Tests', () => {
        it('contains a search box with the correct ID', () => {
            cy.get('#searchselect').should('exist');
        });    

        it('contains a search box with the correct placeholder', () => {            
            cy.get('input[placeholder="Søk etter en utøver"]').should('exist');
        });
    });    

    //'input[placeholder="Søk etter en utøver"]
    describe('Table Header Tests', () => {
        it('should find the UTØVER header in the table', () => {            
            // cy.wait('@yourApiCall'); // Uncomment if waiting for an API call
    
            cy.get('table th').each(($th) => {
                cy.log($th.text());
            });
            cy.get('table th').contains('Utøver').should('exist');
            cy.get('table th').contains('Økter').should('exist');
            cy.get('table th').contains('Rapporter').should('exist');
        });
    });

    // Økter Section Tests
    describe('Økter Section Tests', () => {
        it('displays the Økter heading', () => {
            cy.get('h2').contains('Økter').should('exist');
        });        
    });    


    describe('Create athlete ', () => {
        it('NewAthlete creating route', () => {
            cy.visit('http://localhost:3000/');
    
            // Step 2: Working buttons
            const buttons = ['Ny treningsmal', 'Nye spørsmål', 'Ny utøver'];
            buttons.forEach(btn => {
                cy.get('button').contains(btn).should('exist').and('be.visible');
            });
    
            cy.get('button').contains('Ny utøver').click();   
            cy.visit('http://localhost:3000/new_athlete');
            cy.url().should('include', '/new_athlete');     
            
            cy.get('h1').contains('Registrer ny utøver').should('exist');
            
            //create new athlete
      
            cy.get('input[name="userId"]').type('Ole Olsen');    
            // Dropdowns 
            cy.get('select#genders').select('Mann');             
            //cy.get('select#sport').select('Annet'); 
            cy.get('select#sports').select('skiing');
            cy.get('button').contains('Legg til utøver').should('exist').and('be.visible').click   ;  
            cy.get('button').contains('Tilbake til Dashboard').should('exist').and('be.visible').click   ; 
            cy.visit('http://localhost:3000/');
            cy.get('table th').each(($th) => {
                cy.log($th.text());
            });



            cy.get('table th').contains('Utøver').should('exist');
            cy.get('table th').contains('Økter').should('exist');
            cy.get('table th').contains('Rapporter').should('exist');

       
           cy.wait(2);
           cy.get('table tr td').contains('td', 'Ole Olsen').should('exist');
           
           
           //profil     



            cy.visit('http://localhost:3000/athlete/Ole-Olsen');
            cy.get('button').contains('Endre').should('exist').and('be.visible').click   ;
            cy.get('button').contains('Slett bruker').should('exist').and('be.visible').click   ;   
            cy.get('button').contains('Ny økt').should('exist').and('be.visible').click   ; 



            //cy.get('h2').contains('Utøver info').should('exist');
            cy.get('h5').contains('Mål og konkurranser').should('exist');
            cy.get('h5').contains('Utøver prestasjon').should('exist');
            cy.get('h5').contains('Intensitetssoner').should('exist');
            cy.get('h5').contains('Økter').should('exist');

        });
    });

});

