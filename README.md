Ollama Langchain Document JS

> JavaScript langchain version for Ollama

## Prerequisites

This project requires NodeJS v20 or later and Ollama running locally on your machine at port 11434.

## Setup

Install the Node dependencies with npm

```sh
$ npm install
```

## Run the project locally

```sh
$ npm start
```

This will execute the `index.js` and output the result to your terminal.

## Development

By default this script will answer a default question by fetching the content from the following Wiki page: https://en.wikipedia.org/wiki/2023_Hawaii_wildfires when executed with the `npm start` command.

### Provide a custom question

The `npm start` command allows providing a custom question.

Run the script providing your question surrounded by double quotes.
For example, to know how many people were killed during the 2023 Hawaii wildfires, try this command:

```
npm start -- "How many people were killed during the 2023 Hawaii wildfires?"

  Based on the information provided in the context, there were 97 confirmed deaths due to the Lahaina fire on Maui as of August 17, 2023.

```

### Provide a custom Wiki page

The `npm start` command allows providing a Wiki page name to perform the query against.

Run the script providing a `--type wiki` parameter followed by a Wiki page name.
For example, to answer a question related to the `Terminator 2: Judgment Day` Wiki page located at: https://en.wikipedia.org/wiki/Terminator_2:_Judgment_Day
just run the script like this:

```
npm start -- --type wiki Terminator_2:_Judgment_Day "What was the cast of Terminator 2?"

  Based on the provided context, the cast of Terminator 2: Judgment Day is:

  * Arnold Schwarzenegger as the Terminator
  * Linda Hamilton as Sarah Connor
  * Robert Patrick as the T-1000
  * Edward Furlong as John Connor

```

## License

MIT
