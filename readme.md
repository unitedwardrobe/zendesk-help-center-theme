# Zendesk Help Center Theme

## Local development

Make sure ZAT is installed ([full guide](https://support.zendesk.com/hc/en-us/articles/115012793547-Previewing-theme-changes-locally-Guide-Professional-and-Enterprise-)). This can be done by installing the following Ruby gem:

```
gem install zendesk_apps_tools
```

Create a `.zat` file in root which contains the following:

```json
{
  "subdomain": "https://help.vinted.ca",
  "username": "your_username or your_username/token",
  "password": "your_password or api_token"
}
```

It's recommended to use the token sign-in instead of the actual username and password. This can be done by using `[username]/token` as a username and the API token as the password.

Start the local development server by running:

```
zat theme preview
```

You can now see changes you made locally at https://help.vinted.ca/hc/admin/local_preview/start.
