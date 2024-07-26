const API_URL_COUNTRIES = 'https://restcountries.com/v3.1/all';
const API_URL_CURRENCIES = 'https://api.exchangerate-api.com/v4/latest/';

let currencies = {};
let conversionRates = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch(API_URL_COUNTRIES)
        .then(response => response.json())
        .then(data => {
            currencies = getCurrencies(data);
            populateCurrencyDropdowns(currencies);
        })
        .catch(error => console.error('Error fetching country data:', error));
});

function getCurrencies(data) {
    const currencies = {};
    data.forEach(country => {
        if (country.currencies) {
            Object.keys(country.currencies).forEach(code => {
                if (!currencies[code]) {
                    currencies[code] = country.currencies[code].name;
                }
            });
        }
    });
    return currencies;
}

function populateCurrencyDropdowns(currencies) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    Object.keys(currencies).forEach(code => {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.text = `${code} (${currencies[code]})`;
        fromCurrency.add(option1);

        const option2 = document.createElement('option');
        option2.value = code;
        option2.text = `${code} (${currencies[code]})`;
        toCurrency.add(option2);
    });
}

function fetchConversionRates(baseCurrency) {
    fetch(`${API_URL_CURRENCIES}${baseCurrency}`)
        .then(response => response.json())
        .then(data => {
            conversionRates = data.rates;
            convertCurrency();
        })
        .catch(error => console.error('Error fetching conversion rates:', error));
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('result');

    if (!isNaN(amount) && fromCurrency && toCurrency) {
        if (!conversionRates[fromCurrency]) {
            fetchConversionRates(fromCurrency);
            return;
        }

        const fromRate = conversionRates[fromCurrency];
        const toRate = conversionRates[toCurrency];
        const conversionRate = toRate / fromRate;

        if (conversionRate) {
            const convertedAmount = amount * conversionRate;
            resultElement.textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
        } else {
            resultElement.textContent = 'Conversion rate not available';
        }
    } else {
        resultElement.textContent = '';
    }
}
