import "react-native";
import React from "react";
import SearchScreen from "../screens/SearchScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// Test if initial search navigation returns
test("searchProducts should return any valid first page of results given valid input and state", () => {
    const Search = new SearchScreen()
    Search.state.input = "fish"
    Search.state.location = "01400376"
    let results = Search.searchProducts(Search.state)
    expect(results).not.toBeUndefined()
})

// Test if validateCountryCategoryChoices removes no countries if they're all in the new available list
test("validateCountryCategoryChoices should remove no selected countries if they're all in the available list of countries", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCountries = ["UNITED STATES", "PUERTO RICO"]
    Search.state.allAvailableCountries = ["PUERTO RICO", "GUAM", "UNITED STATES"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCountries)
    expect(Search.state.filters.selectedCountries).toEqual(["UNITED STATES", "PUERTO RICO"])
})

// Test if validateCountryCategoryChoices removes all countries if none are in the new available list
test("validateCountryCategoryChoices should remove every selected country if none are in the available list of countries", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCountries = ["UNITED STATES", "PUERTO RICO"]
    Search.state.allAvailableCountries = ["GERMANY", "GUAM", "CANADA"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCountries)
    expect(Search.state.filters.selectedCountries).toEqual([])
})

// Test if validateCountryCategoryChoices correctly removes countries that aren't in the new available list
test("validateCountryCategoryChoices should remove currently selected countries that aren't in the available list of countries", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCountries = ["UNITED STATES", "PUERTO RICO"]
    Search.state.allAvailableCountries = ["PUERTO RICO", "GUAM", "CHINA"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCountries)
    expect(Search.state.filters.selectedCountries).toEqual(["PUERTO RICO"])
})


// Test if validateCountryCategoryChoices removes no categories if they're all in the new available list
test("validateCountryCategoryChoices should remove no selected cateogories if they're all in the available list of categories", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCategories = ["Candy", "Fruit", "Frozen"]
    Search.state.allAvailableCategories = ["Candy", "Dairy", "Produce", "Fruit", "Frozen"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCategories)
    expect(Search.state.filters.selectedCategories).toEqual(["Candy", "Fruit", "Frozen"])
})

// Test if validateCountryCategoryChoices removes all categories if none are in the new available list
test("validateCountryCategoryChoices should remove every selected category if none are in the available list of categories", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCategories = ["Candy", "Fruit", "Frozen"]
    Search.state.allAvailableCategories = ["Dairy", "Produce"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCategories)
    expect(Search.state.filters.selectedCategories).toEqual([])
})

// Test if validateCountryCategoryChoices correctly removes categories that aren't in the new available list
test("validateCountryCategoryChoices should remove currently selected categories that aren't in the available list of categories", () => {
    const Search = renderer.create(<SearchScreen/>).getInstance()
    Search.state.filters.selectedCategories = ["Candy", "Fruit", "Frozen"]
    Search.state.allAvailableCategories = ["Dairy", "Fruit", "Produce", "Candy"]
    Search.validateCountryCategoryChoices()
    console.log(Search.state.filters.selectedCategories)
    expect(Search.state.filters.selectedCategories).toEqual(["Candy", "Fruit"])
})
