import { StyleSheet } from "react-native";

const globalStyle = StyleSheet.create({
  wholeScreen: {
    backgroundColor: "#fff",
    height: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    justifyContent: "space-evenly",
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderWidth: 5,
    borderRadius: 999,
    backgroundColor: "#fff",
    padding: 2,
  },
  icon: {
    width: 36,
    height: 36,
    alignSelf: "center",
  },
  navButtonContainer: {
    width: 54,
  },
  headerButtonRow: {
    alignContent: "space-between",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerButtonStyle: {
    flex: 1,
    backgroundColor: "black",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  headerDivider: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  subHeaderText: {
    fontWeight: "bold",
    fontSize: 30,
    marginLeft: 8,
  },
  inputContainer: {
    borderWidth: 7,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  wideInputContainer: {
    borderWidth: 7,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 25,
    fontWeight: "bold",
    fontSize: 18,
    maxHeight: 60,
    minHeight: 50,
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8,
  },
  smallButtonStyle: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 8,
    maxHeight: 30,
    minHeight: 30,
    maxWidth: 110,
    marginLeft: 8,
  },
  smallButtonText: {
    textAlignVertical: "center",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  wideButtonStyle: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 20,
    maxHeight: 50,
    minHeight: 50,
    marginLeft: 8,
    marginRight: 8,
  },
  wideButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  paragraph: {
    marginTop: 25,
    fontSize: 18,
    marginLeft: 8,
    marginRight: 8,
  },
  billingDeliveryInput: {
    borderWidth: 7,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 25,
    fontWeight: "bold",
    fontSize: 18,
    maxHeight: 60,
    minHeight: 50,
    marginLeft: 8,
    marginRight: 8,
  },
  date_code: {
    paddingHorizontal: 25,
    borderWidth: 7,
    borderRadius: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    fontSize: 18,
    maxHeight: 60,
    minHeight: 50,
  },
  date_codeContainter: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: "45%",
    maxWidth: "45%",
  },
  date_codeContainter_right: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: "60%",
    maxWidth: "60%",
  },
  date_codeContainter_left: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: "35%",
    maxWidth: "35%",
  },
  date_codes: {
    flexDirection: "row",
    justifyContent: "center",
    justifyContent: "space-evenly",
  },
});

export default globalStyle;
