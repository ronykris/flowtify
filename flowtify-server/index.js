const getTxns = async () => {
    try {
        const response = await fetch("https://query.testnet.flowgraph.co/?token=5a477c43abe4ded25f1e8cc778a34911134e0590", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB,en;q=0.5",
                "content-type": "application/json",
                "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "sec-gpc": "1",
                "Referer": "https://testnet.flowscan.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"operationName\":\"TransactionStreamInitialQuery\",\"variables\":{\"first\":15},\"query\":\"query TransactionStreamInitialQuery($first: Int!) {\\n  transactions(first: $first) {\\n    edges {\\n      node {\\n        ...TransactionStreamItemFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment TransactionStreamItemFragment on Transaction {\\n  hash\\n  eventCount\\n  proposer {\\n    address\\n    __typename\\n  }\\n  __typename\\n}\\n\"}",
            "method": "POST"
        });
        const data = await response.json()
        const txnArray = data.data.transactions.edges
        const txnListLen = txnArray.length
        let txnList = []
        //console.log(txnArray)   
        for ( let i=0; i<txnListLen; i++){                 
            if (txnArray[i].node){
                let txnId = txnArray[i].node.hash
                console.log(txnId)
                const authorizers = await getTxnDetails(txnId)
                //txnList.push(txnId)
            }                        
        }    
        //console.log(txnList)
        getTxns()
    } catch (e) {
        console.error(e)
        //getTxns()    
    }
    
}


const getTxnDetails = async (id) => {
    if (id) {
        const response = await fetch("https://query.testnet.flowgraph.co/?token=5a477c43abe4ded25f1e8cc778a34911134e0590", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB,en;q=0.5",
                "content-type": "application/json",
                "sec-ch-ua": "\"Brave\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "sec-gpc": "1",
                "Referer": "https://testnet.flowscan.org/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `{\"operationName\":\"TransactionViewerLayoutQuery\",\"variables\":{\"id\":\"${id}\"},\"query\":\"query TransactionViewerLayoutQuery($id: ID!) {\\n  checkTransaction(id: $id) {\\n    ...TransactionViewerHeaderFragment\\n    __typename\\n  }\\n}\\n\\nfragment TransactionViewerHeaderFragment on CheckTransactionResult {\\n  status\\n  ...TransactionRolesFragment\\n  transaction {\\n    hasError\\n    ...TransactionResultFragment\\n    ...TransactionTimeFragment\\n    ...TransactionTransfersFragment\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment TransactionRolesFragment on CheckTransactionResult {\\n  proposer {\\n    address\\n    __typename\\n  }\\n  payer {\\n    address\\n    __typename\\n  }\\n  authorizers {\\n    address\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment TransactionTimeFragment on Transaction {\\n  time\\n  block {\\n    height\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment TransactionResultFragment on Transaction {\\n  status\\n  error\\n  eventCount\\n  contractInteractions {\\n    id\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment TransactionTransfersFragment on Transaction {\\n  tokenTransfers {\\n    edges {\\n      node {\\n        type\\n        account {\\n          address\\n          __typename\\n        }\\n        amount {\\n          token {\\n            id\\n            __typename\\n          }\\n          value\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  nftTransfers {\\n    edges {\\n      node {\\n        nft {\\n          contract {\\n            id\\n            __typename\\n          }\\n          nftId\\n          __typename\\n        }\\n        from {\\n          address\\n          __typename\\n        }\\n        to {\\n          address\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\"}`,
            "method": "POST"
        });
        const data = await response.json()
        if (data.data.checkTransaction.status) {
            if (data.data.checkTransaction.status !== 'Sealed'){
                const authList = data.data.checkTransaction.authorizers
                const authListLen = authList.length
                let authorizers = []
                for ( let i=0; i<authListLen; i++) {
                    authorizers.push(authList[i].address)
                }
                console.log(id + " : " + authorizers)  
                return authorizers          
            }
        }
        
        //console.log(data.data)
    }    
}
//getTxnDetails('a587a693badfe3b544b4658aa7f10ddbf02c187d3723359776b7e55741fea062')
getTxns()
