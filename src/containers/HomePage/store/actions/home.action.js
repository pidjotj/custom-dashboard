import data from '../../../../data/metrics.json';

export const GET_JSON_FILE = "GET_JSON_FILE";

export function getInfosFromJSON() {
  console.log("getInfos called");
  return (dispatch) => {
    dispatch({
      type: GET_JSON_FILE,
      payload: data
    });
    console.log("payload", data)
  }
}
