import { LightningElement, wire, api } from "lwc";
import { gql, graphql } from "lightning/uiGraphQLApi";
// import userId from "@salesforce/user/Id";

export default class GraphQLApi extends LightningElement {

  results;

  @wire(graphql, {
    query: gql`
      query AccountWithName {
        uiapi {
          query {
            Account(first: 5) {
              totalCount
              edges { 
                node { 
                  Id 
                  Name { value }
                }
              }
            }
          }
        }
      }
    `,
  })
  graphQLAccount({ data, errors }) {
    if (data) {
        // console.log('Account graphql '+ JSON.stringify(data));
        this.results = data.uiapi.query.Account.edges.map((edge) => edge.node);
    } else if(errors) {
      console.log('Account graphql error: '+ errors);
    }
  }


// ----------------------------------------------------------------------------------------------------------------------------------

  aggregateResult;

  @wire(graphql, {
    query: gql`
      query AvgandSumOfAccount {
        uiapi {
          aggregate {
            Account {
              edges {
                node {
                  aggregate {
                    Amount__c {
                      avg {
                        displayValue
                      }
                      sum {
                        displayValue
                      }
                    }
                  }
                }
              }
              totalCount
            }
          }
        }
      }
    `,
  })
  graphQLAggregateResult({ data, errors }) {
    if (data) {
        // console.log('Account Aggregate result: '+ JSON.stringify(data));
        this.aggregateResult = data.uiapi.aggregate.Account.edges.map((edge) => edge.node);
        
    } else if(errors) {
      console.log('Account Aggregate error: '+ JSON.stringify(errors));
    }
  }

  // ----------------------------------------------------------------------------------------------------------------------------------

  filterResult;

  columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'AnnualRevenue', fieldName: 'AnnualRevenue' },
  ]
  minAmount = "5000000";
  minAmounts = [
    { label: "All", value: "0" },
    { label: "$5,000,000", value: "5000000" },
    { label: "$50,000,000", value: "50000000" },
    { label: "$500,000,000", value: "500000000" },
  ];

  @wire(graphql, {
    query: gql`
      query bigAccounts($minAmount: Currency) {
        uiapi {
          query {
            Account(where: { AnnualRevenue: { gte: $minAmount } }) {
              edges {
                node {
                  Id
                  Name {
                    value
                  }
                  AnnualRevenue {
                    displayValue
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: "$variables", // Use a getter function to make the variables reactive
  })
  graphqlFilterResult({ data, errors }) {
    if (data) {
      this.filterResult = data.uiapi.query.Account.edges.map((edge) => ({
        Id: edge.node.Id,
        Name: edge.node.Name.value,
        AnnualRevenue: edge.node.AnnualRevenue.displayValue,
      }));
    } else if(errors) {
        console.log('Account filterResult error: '+ JSON.stringify(errors));
    }
  }

  get variables() {
    return {
      minAmount: this.minAmount,
    };
  }

  // Called when the user selects a new minimum amount
  handleMinAmountChange(event) {
    this.minAmount = event.detail.value;
  }


  //-------------------------------------------------------------------------------------------------------------------------------------
  //multipleObjectsGraphQL.js
  queryError;
  accounts;
  cases;

  @wire(graphql, {query: "$multiObjQuery"})
  graphMultiObjResult({ data, errors }) {
    if (data) {
      this.accounts = data.uiapi.query.Account.edges.map((edge) => ({
        Id: edge.node.Id,
        Name: edge.node.Name.value,
        Industry: edge.node.Industry.value,
      }));
      this.cases = data.uiapi.query.Case.edges.map((edge) => ({
        AccountId: edge.node.AccountId.value,
        Priority: edge.node.Priority.value,
        Subject: edge.node.Subject.value
      }));
    }

    else if (errors) {
      this.queryError = errors.error.message;
      console.log('Multiple Query Error '+ errors.error.message);
    }
  }

  get multiObjQuery() {
    return gql`
      query AccountsAndCases {
        uiapi {
          query {
            Account {
              edges {
                node {
                  Name { value }
                  Industry { value }
                }
              }
            }
            Case(where: { AccountId: { inq: { Account: {
              and: [
                { Name: { like: "United%" } },
                { Industry: { eq: "Energy" } }
              ]},
                ApiName:"Id" } } }) {
              edges {
                node {
                  AccountId { value }
                  Priority { value }
                  Subject { value }
                }
              }
            }
          }
        }
      }`;
  }
}