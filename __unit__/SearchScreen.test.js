import "react-native";
import React from "react";
import SearchScreen from "../screens/SearchScreen";
import renderer from "react-test-renderer"; // renders the components
import { render } from "react-native-testing-library";

// testing if sort(sortPricesAsc) returns a correct sorted list
test("sortPricesAsc should sort a list of items by price asc", () => {
    const searchScreen = renderer.create(<SearchScreen/>).getInstance()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                            {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0},
                            {"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    items.sort(searchScreen.sortPriceAsc)
    expect(items).toEqual(expectedItems)
})

// testing if sort(sortPriceDesc) returns a correct sorted list
test("sortPriceDesc should sort a list of items by price desc", () => {
    const searchScreen = renderer.create(<SearchScreen/>).getInstance()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                            {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    items.sort(searchScreen.sortPriceDesc)
    expect(items).toEqual(expectedItems)
})

// testing if sort(sortAlpha) returns a correct sorted list
test("sortAlpha should sort a list of items by name, A-Z", () => {
    const searchScreen = renderer.create(<SearchScreen/>).getInstance()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                            {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    items.sort(searchScreen.sortAlpha)
    expect(items).toEqual(expectedItems)
})

// testing if sort(sortAlphaReverse) returns a correct sorted list
test("sortAlphaReverse should sort a list of items by name, Z-A", () => {
    const searchScreen = renderer.create(<SearchScreen/>).getInstance()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 0},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 0},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 0},
                            {"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 0}]
    items.sort(searchScreen.sortAlphaReverse)
    expect(items).toEqual(expectedItems)
})

// testing if sort(sortUnitPrice) returns a correct sorted list
test("sortUnitPrice should sort a list of items by unit price, asc; all items have a valid unit price", () => {
    const Search = new SearchScreen()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 10}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 5}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": 5},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": 10},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                            {"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20}]
    let itemsUpdated = Search.updateUndefinedUPrice(items)
    itemsUpdated.sort(Search.sortUnitPrice)
    expect(itemsUpdated).toEqual(expectedItems)
})

test("sortUnitPrice should sort a list of items by unit price, asc; items with undefined unit price should appear at the end", () => {
    const Search = new SearchScreen()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": undefined}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": undefined}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                            {"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": Number.MAX_SAFE_INTEGER},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": Number.MAX_SAFE_INTEGER},]
    let itemsUpdated = Search.updateUndefinedUPrice(items)
    itemsUpdated.sort(Search.sortUnitPrice)
    expect(itemsUpdated).toEqual(expectedItems)
})

test("sortUnitPrice should sort a list of items by unit price, asc; items with null unit price should appear at the end", () => {
    const Search = new SearchScreen()
    const items = [{"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                    "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20},
                    {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                     "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": null}, 
                     {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                     {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                     "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": null}, 
                     {"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                     "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0}]
    const expectedItems = [{"id": "0008000051309", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "StarKist Tuna Creations Lemon Pepper Seasoned Tuna", "unitPrice": 0},
                            {"id": "0002400016302", "inCart": false, "price": 1.25, "quantity": 1, 
                            "stock": "Low", "title": "DEL MONTE FRESH CUT Golden Sweet Whole Kernel Corn Canned Vegetables", "unitPrice": 10},
                            {"id": "0001111006770", "inCart": false, "price": 4.99, "quantity": 1, 
                            "stock": "Low", "title": "Bakery Fresh Goodness Plain Angel Food Cake", "unitPrice": 20},
                            {"id": "0005100023314", "inCart": false, "price": 1.25, "quantity": 1,
                            "stock": "Low", "title": "SpaghettiOs Canned Pasta with Meatballs", "unitPrice": Number.MAX_SAFE_INTEGER},
                            {"id": "0073639351010", "inCart": false, "price": 1.67, "quantity": 1, 
                            "stock": "Low", "title": "Glory Foods Seasoned Southern Style Pinto Beans", "unitPrice": Number.MAX_SAFE_INTEGER},]
    let itemsUpdated = Search.updateUndefinedUPrice(items)
    itemsUpdated.sort(Search.sortUnitPrice)
    expect(itemsUpdated).toEqual(expectedItems)
})