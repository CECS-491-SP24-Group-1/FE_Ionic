import axios from "axios";

//Create a new Axios instance; this is needed to prevent infinite loops from the inner request
const axiosInst = axios.create({
	withCredentials: true
	//validateStatus: () => true //https://stackoverflow.com/a/76240990
});

//Export for use elsewhere
const credAxios = axiosInst;
export default credAxios;
