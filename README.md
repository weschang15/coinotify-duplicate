# Coinotify Duplicate

This is the nightly version of our MVP. I am in the process of converting from a standard REST API infrastructure to a GraphQL API with Apollo Server. Coinotify was originally a dead simple nodejs application that would send SMS alerts via Twilio when a user-defined trigger was set (i.e. I want to know when BTC dropped 5%). It is now being massaged into an automated trading platform that uses the Bittrex and Binance APIs as well as an in-house developed formula. This, in theory, allows users to buy/sell cryptocurrencies without having to consistently watch trading charts.

## For portfolio purposes only

This excludes our formula used to trigger bid and ask trades via Bittrex API. This repo also excludes the React frontend

## Features

- TODO:// Securely connect Bittrex account with API keys (encrpted with AES 256)
- Regularly pings Binance API for up-to-date data
- Runs bids/asks concurrently without blocking the event loop using background processing with AgendaJS
