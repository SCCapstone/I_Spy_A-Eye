import "react-native";
import React from "react";
import SearchScreen from "../screens/SearchScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";


test("countriesFromProduct should yield an empty array of country objects if there are no products in latest results (empty)", () => {
    const Search = new SearchScreen()
    expect(Search.countriesFromProducts([]).length).toEqual(0)
})

test("countriesFromProduct should yield an array of one country object if there is only one product in latest results", () => {
    const Search = new SearchScreen()
    expect((Search.countriesFromProducts(
        [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, 
        "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0}]
        )).length).toEqual(1)
})

test("countriesFromProduct should yield a single object for 'UNITED STATES' if there is only one product in latest results with origin country 'UNITED STATES'", () => {
    const Search = new SearchScreen()
    expect((Search.countriesFromProducts(
        [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, 
        "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0}]
        ))).toEqual([{key: 'UNITED STATES', value: 'UNITED STATES'}])
})


test("countriesFromProduct should yield an array of one country object if there are multiple products with the same origin country in latest results", () => {
    const Search = new SearchScreen()
    expect((Search.countriesFromProducts(
        [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, 
        "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
        {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", 
        "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
        {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low",
         "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}]
        )).length).toEqual(1)
})

test("countriesFromProduct should yield a single object for 'UNITED STATES' if there are multiple products in latest results only with origin country 'UNITED STATES'", () => {
    const Search = new SearchScreen()
    expect((Search.countriesFromProducts(
        [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, 
        "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
        {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", 
        "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
        {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low",
         "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}]
        ))).toEqual([{key: 'UNITED STATES', value: 'UNITED STATES'}])
})

test("countriesFromProduct should yield two countries objects if there are multiple products in latest results that have either of those origin countries", () => {
    const Search = new SearchScreen()
    expect((Search.countriesFromProducts(
        [{"countryOrigin": "MEXICO", "id": "0007097057087", "inCart": false, 
        "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
        {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", 
        "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
        {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low",
         "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0},
         {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", 
         "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
        ))).toEqual([{key: 'MEXICO', value: 'MEXICO'},{key: 'UNITED STATES', value: 'UNITED STATES'}])
})

test("onSelectedItemsChange should preserve the current state of filters if no countries were selected", () => {
    const Search = new SearchScreen()
    let oldFilters = Search.state.filters
    Search.onSelectedItemsChange([])
    expect(oldFilters).toBe(Search.state.filters)
})

test("onSelectedItemsChange should only update the selectedCountries filters property if a country was selected", () => {
    const Search = new SearchScreen()
    let oldFilters = Search.state.filters
    oldFilters.selectedCountries = ['UNITED STATES']
    Search.onSelectedItemsChange(['UNITED STATES'])
    expect(oldFilters).toBe(Search.state.filters)
})

test("onSelectedItemsChange should only update the selectedCountries filters property no matter how many countries were selected (5)", () => {
    const Search = new SearchScreen()
    let oldFilters = Search.state.filters
    oldFilters.selectedCountries = ['UNITED STATES', 'CANADA', 'MEXICO', 'JAPAN', 'CHINA']
    Search.onSelectedItemsChange(['UNITED STATES', 'CANADA', 'MEXICO', 'JAPAN', 'CHINA'])
    expect(oldFilters).toBe(Search.state.filters)
})

test("onSelectedItemsChange should only update the selectedCountries filters property with the most recently selected countries", () => {
    const Search = new SearchScreen()
    let expectedFilters = Search.state.filters
    expectedFilters.selectedCountries = ['UNITED STATES', 'CANADA']

    Search.state.filters.selectedCountries = ['UNITED STATES', 'CANADA', 'MEXICO', 'JAPAN', 'CHINA']
    Search.onSelectedItemsChange(['UNITED STATES', 'CANADA'])
    expect(Search.state.filters).toBe(expectedFilters)
})

test("filterResultsByCountry should filter out every search result if no countries are selected", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
                    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
                    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
                    {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
    let filteredResults = Search.filterResultsByCountry()
    expect(filteredResults).toEqual([])
})

test("filterResultsByCountry should filter out every result without the selected country as its origin country", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
                    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
                    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
                    {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
    Search.state.filters.selectedCountries = ['UNITED STATES']
    let filteredResults = Search.filterResultsByCountry()
    expect(filteredResults).toEqual([{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}])
})

test("filterResultsByCountry should filter out every result without the selected countries (two) as its origin country", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
                    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
                    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
                    {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
    Search.state.filters.selectedCountries = ['UNITED STATES', 'CANADA']
    let filteredResults = Search.filterResultsByCountry()
    expect(filteredResults).toEqual([{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0},
    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0},  
    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}])
})

test("filterResultsByCountry should filter out no result if all available countries are selected", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
                    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
                    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
                    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
                    {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
    Search.state.filters.selectedCountries = ['UNITED STATES', 'CANADA', 'MEXICO']
    let filteredResults = Search.filterResultsByCountry()
    expect(filteredResults).toEqual([{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
    {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
    {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
    {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
    {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}])
})

test("filterResultsByStock should return no products if there aren't any products to filter", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = []
    let filteredResults = Search.filterResultsByStock()
    expect(filteredResults).toEqual([])
})

test("filterResultsByStock should filter out no result if all products are in stock (Low or High)", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "N/A", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Temp. Out", "title": "Simple Truth® Water", "unitPrice": 0}]
    let filteredResults = Search.filterResultsByStock()
    expect(filteredResults).toEqual([{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0}])
})

test("filterResultsByStock should filter out no result if all products are in low stock", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "Low", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "Low", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Water", "unitPrice": 0}]
    let filteredResults = Search.filterResultsByStock()
    expect(filteredResults).toEqual([{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "Low", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
    {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "Low", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Water", "unitPrice": 0}])
})

test("filterResultsByStock should filter out no result if all products are in high stock", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "High", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "High", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "High", "title": "Simple Truth® Water", "unitPrice": 0}]
    let filteredResults = Search.filterResultsByStock()
    expect(filteredResults).toEqual([{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
    {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "High", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "High", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
    {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "High", "title": "Simple Truth® Water", "unitPrice": 0}])
})

test("filterResultsByStock should filter out every result if all products are either out of stock or the info is unavailable", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "N/A", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "N/A", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Temp. Out", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Temp. Out", "title": "Simple Truth® Water", "unitPrice": 0}]
    let filteredResults = Search.filterResultsByStock()
    expect(filteredResults).toEqual([])
})

test("filterResultsByStock should work in conjunction with filterResultsByCountry; country then stock", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "N/A", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Temp. Out", "title": "Simple Truth® Water", "unitPrice": 0}]
    Search.state.filters.selectedCountries = ['UNITED STATES']
    Search.state.latestResults = Search.filterResultsByCountry()
    let filteredResults = Search.filterResultsByStock()
    
    expect(filteredResults).toEqual([{"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0}])
})

test("filterResultsByStock should work in conjunction with filterResultsByCountry; stock then country", () => {
    const Search = new SearchScreen()
    Search.state.latestResults = [{"countryOrigin": "CANADA", "id": "0001111085808", "inCart": false, "price": 3.29, "quantity": 1, "stock": "High", "title": "Kroger® Purified Water Mini Bottles", "unitPrice": 0},
                                 {"countryOrigin": "MEXICO", "id": "0078616200281", "inCart": false, "price": 9.99, "quantity": 1, "stock": "N/A", "title": "Smartwater Vapor Distilled Electrolyte Premium Water Bottles", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0},
                                 {"countryOrigin": "UNITED STATES", "id": "0001111090274", "inCart": false, "price": 7.49, "quantity": 1, "stock": "Temp. Out", "title": "Simple Truth® Water", "unitPrice": 0}]
    Search.state.filters.selectedCountries = ['UNITED STATES']
    Search.state.latestResults = Search.filterResultsByStock()
    let filteredResults = Search.filterResultsByCountry()
    
    expect(filteredResults).toEqual([{"countryOrigin": "UNITED STATES", "id": "0001111090275", "inCart": false, "price": 6.49, "quantity": 1, "stock": "Low", "title": "Simple Truth® Vapor Distilled Water with Electrolytes", "unitPrice": 0}])
})



// test("filterResultsByCountry should correctly filter product search results given a single country", () => {
//     const searchScreen = renderer.create(<SearchScreen/>).getInstance()
//     const items = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
//                     {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
//                     {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
//                     {"countryOrigin": "CANADA", "id": "0007046243383", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Sour Patch Kids Bunnies Soft And Chewy Easter Candy", "unitPrice": 0}, 
//                     {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}, 
//                     {"countryOrigin": "MEXICO", "id": "0004142004126", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Brach's Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}]
//     const expectedItems = [{"countryOrigin": "UNITED STATES", "id": "0007097057087", "inCart": false, "price": 1.67, "quantity": 1, "stock": "Low", "title": "Peeps® Decorated Eggs Marshmallow Easter Candy", "unitPrice": 0},
//                     {"countryOrigin": "UNITED STATES", "id": "0001130007144", "inCart": false, "price": 2, "quantity": 1, "stock": "Low", "title": "Brach's® Classic Jelly Bird Eggs Easter Candy", "unitPrice": 0}, 
//                     {"countryOrigin": "UNITED STATES", "id": "0002200012228", "inCart": false, "price": 3, "quantity": 1, "stock": "Low", "title": "Life Savers Gummies Bunnies & Eggs Easter Candy Assortment Bag", "unitPrice": 0}, 
//                     {"countryOrigin": "UNITED STATES", "id": "0002200028877", "inCart": false, "price": 1.25, "quantity": 1, "stock": "Low", "title": "Skittles Original Chewy Candy Theater Box Easter Basket Candy", "unitPrice": 0}] 
//     items.sort(searchScreen.sortPriceAsc)
//     expect(items).toEqual(expectedItems)
// })