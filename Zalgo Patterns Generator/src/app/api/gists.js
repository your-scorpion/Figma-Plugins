import {request} from './request'

export const getPublicGistsApi = () => {
	return request.get("/gists/public?page=1")
};
