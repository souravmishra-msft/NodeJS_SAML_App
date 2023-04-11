# Sample Node SAML WebApp

## A NodeJS based SAML application for Azure Active Directory.

| page_type | languages                      | products               |
| --------- | ------------------------------ | ---------------------- |
| sample    | nodejs, express, passport-saml | azure-active-directory |

To configure and test Azure AD SSO with Sample Node SAML WebApp, perform the following steps:

## **Configure Azure AD SSO**

Follow the steps to enable Azure AD SSO in the Azure Portal.

1. Create an Azure AD test user - to test Azure AD single sign-on.
2. Create a Azure AD Security Group - add the test user to this group.
3. In the Azure portal, select **Azure Active Directory > Enterprise applications** and select **Create your own application**.
4. Enter the display name for your new application, select **Integrate any other application you don't find in the gallery (Non-Gallery)**, then select **Create**.
5. On the app's page, select **Single sign-on** under **Manage** section.
6. Select **SAML** as the single sign-on method.
7. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.
8. On the Basic SAML Configuration section, perform the following steps:
   - In the **Identifier (Entity ID)** text box, type the name of the app. For eg: `node_saml_app`
   - In the **Reply URL** text box, type the URL: `https://localhost:5001/login/callback`
   - In the **Logout URL** text box, type the URL: `https://localhost:5001/logout/callback`
9. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Raw)** and select **Download** to download the certificate and save it on your computer.
10. On the **Set up [App-Name]** section, copy the the **Login URL**.

## **Setup the Node.js application**

Follow the steps to setup and run the sample application.

1.  Clone or download this repository.
    ```
    git clone
    ```
2.  First you start to install all the required dependencies listed under the `package.json` file by running the command:
    ```
    npm install
    ```
3.  Once the command completes, you will find a folder named node_modules available in your project directory with all the dependencies installed in it.
4.  Under the project folder, create a folder called `certificates` and copy the earlier downloaded certificate from SAML application configuration in Azure Active Directory to this newly created `certificates` folder.
5.  To setup the local express server run on https follow the steps mentioned [here](https://javascript.plainenglish.io/enable-https-for-localhost-during-local-development-in-node-js-96204453d72b).
6.  Under the config folder, create a main.env file and add the following in that file.

    ```
    PORT = 5000
    HTTPS_PORT = 5001

    SSO_ENTRYPOINT = <Login URL copied from earlier>
    SSO_ISSUER = <App-Identifier-Name>
    SSO_CALLBACKURL = https://localhost:5001/login/callback
    SSO_CALLBACKLOGOUTURL = https://localhost:5001/logout/callback

    ```

7.  Run the app using the following command:
    ```
    npm run start-dev
    ```
8.  Open your favourite web browser and type the following URL `https://localhost:5001` to access the sample NodeJS-SAML-App.

9.  Once the app runs successfully you should see the following screen.
    ![NodeJS-SAML-App](/images/NodeJS-SAML-App.png)

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

- Click on the **Test** button under the **Test single sign-on with [App-Name]** section in the app's page under **Enterprise applications**. This will redirect to **NodeJS-SAML-App's** signon URL where you can initiate the login flow.
- Go to https://localhost:5001/ access the sample app and initiate the login flow by clicking on the `Login` button.
