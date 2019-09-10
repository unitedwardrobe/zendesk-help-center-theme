# Zendesk Help Center Theme

## Local development

Make sure ZAT is installed ([full guide](https://support.zendesk.com/hc/en-us/articles/115012793547-Previewing-theme-changes-locally-Guide-Professional-and-Enterprise-)). This can be done by installing the following Ruby gem:

```
gem install zendesk_apps_tools
```

Create a `.zat` file in root which contains the following:

```json
{
  "subdomain": "https://support.unitedwardrobe.com",
  "username": "your_username or your_username/token",
  "password": "your_password or api_token"
}
```

It's recommended to use the token sign-in instead of the actual username and password. This can be done by using `[username]/token` as a username and the API token as the password.

Start the local development server by running:

```
zat theme preview
```

You can now see changes you made locally at https://unitedwardrobe.zendesk.com/hc/admin/local_preview/start.

## Supply form data

The contact form supports an order dropdown. This dropdown needs to be supplied with orders. This GraphQL query must be used to fetch the orders:

```graphql
query ZendeskFormPrefillData {
  viewer {
    account {
      email {
        emailAddress
      }
    }
    purchases: ordersConnection(first: 100, type: BOUGHT) {
      ...ZendeskOrdersConnection
    }
    sales: ordersConnection(first: 100, type: SOLD) {
      ...ZendeskOrdersConnection
    }
  }
}

fragment ZendeskOrdersConnection on OrdersConnection {
  nodes {
    createdOn
    orderReference
    payment {
      value {
        amount
      }
    }
    viewerIsSeller
    ... on LegacyOrder {
      item {
        ... on Product {
          image {
            url
          }
        }
        ... on ProductBidGroup {
          product {
            image {
              url
            }
          }
        }
        ... on BundleBidGroup {
          image {
            url
          }
        }
      }
    }
    ... on CartGroupOrder {
      cartGroup {
        items {
          ... on Product {
            image {
              url
            }
          }
          ... on ProductBidGroup {
            product {
              image {
                url
              }
            }
          }
          ... on BundleBidGroup {
            image {
              url
            }
          }
        }
      }
    }
  }
}
```

The result can be sent to the Zendesk theme by sending an event:

```js
var response = { data: { viewer: /* ... */ } };
dispatchEvent(new CustomEvent('populateForm', { detail: response }));
```
