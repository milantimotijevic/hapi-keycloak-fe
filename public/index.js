const keycloak = Keycloak({
    url: 'http://localhost:8080/auth',
    realm: 'augustus',
    clientId: 'augustus_client',
});
let authorization; // TODO see if this is needed for anything

keycloak.onTokenExpired = function () {
    console.log('calling refresh...');
    keycloak.updateToken().success(function(refreshed) {
        if (refreshed) {
            console.log('Token refreshed');
        } else {
            console.log('Token not refreshed.... no idea why lol');
        }
    }).error(function() {
        console.log('Error refreshing token')
    });
};

const loggedInAsSpan = document.getElementById('logged-in-as');
keycloak.onAuthSuccess = function() {
    loggedInAsSpan.innerHTML = ' NAME: ' + keycloak.tokenParsed.preferred_username + ' / ROLES: ' + keycloak.tokenParsed.realm_roles;
};

keycloak.init({
    responseMode: 'fragment',
    flow: 'standard',
    onload: 'check-sso'
}).success(function(authenticated) {
    authorization = new KeycloakAuthorization(keycloak);
});

const displayDiv = document.getElementById('display-div');

function getHealthCheck() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            displayDiv.innerHTML = this.responseText;
        } else {
            displayDiv.innerHTML = 'You may not access this resource! FOOL!';
        }
    };
    xhttp.open("GET", "http://localhost:3001/dataset" + name, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + keycloak.token);
    xhttp.send();
}
