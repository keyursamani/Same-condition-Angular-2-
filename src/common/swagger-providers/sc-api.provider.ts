import {
    Http,
    Headers,
    Response,RequestOptions
} from "@angular/http";
import {
    Observable
} from "rxjs/Observable";
import "rxjs/Rx";
import {
    Injectable
} from "@angular/core";
import 'rxjs/add/operator/map';



export interface patient_signup {
    first_name: string;
    last_name: string;
    password: string;
    birthday: string;
    role ? : string;
}

export interface researcher_signup {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role : string;
    degree_earned_id : number;
    year_completed: number;
    bio: string;
    license_approval_urls: any;
}

export interface physician_signup {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role : string;
    current_practice_id: number;
    year_completed: number;
    bio: string;
    license_approval_urls: any;
    degree: any;
    license: any;
    location_of_clinical_facility: string;
    name_of_clinical_facility: string;
}

export interface post_degree_signup {
    name: string;
}

export interface post_practice_signup {
    name: string;
}

export interface api_feeds {
    filter: string;
    user_id: string;
    page : number;
    per_page: number;
    offset: number;
}

export interface auth_loginWrapper {
    body: patient_signup,
    headers: Headers
}

export interface user_signin{
    email: string;
    password: string;
}


/**
 *
 * @class SCApi
 * @param {(string)} [domainOrOptions] - The project domain.
 */
@Injectable()
export class SCApi {

    private domain: string;

    constructor(private http: Http) { //had to include HTTP_PROVIDERS in bootstrap (global) for this to work. Workaround needed
        // this.domain = "https://dev.samecondition.com/api/v1";
       // this.domain = "http://samecondition.herokuapp.com/api/v1";
         this.domain ="http://52.173.139.178/api/v1";
    }

    /**
     * Handles api call error
     * @param {any} error
     * @returns {ErrorObservable}
     */
    private handleError(error: any) {
        let errMsg = error || {
            status: 500
        };
        return Observable.throw(errMsg);
    }

    /**
     * Set pattern type parameters
     * @param {string} pattern - the regex pattern
     * @returns {Object} the query parameters
     */
    private setPatternTypeParameter(pattern, queryParameters, parameters) {
        Object.keys(parameters).forEach(function(parameterName) {
            if (new RegExp(pattern).test(parameterName)) {
                queryParameters[parameterName] = parameters[parameterName];
            }
        });
        return queryParameters;
    }

    /**
     * Set pattern type parameters
     * @param {string} camelCaseName - the camel case name of the parameter
     * @param {string} name - the name of the parameter
     * @returns {Object} the query parameters
     */
    private setNonPatternTypeParameter(camelCaseName: string, name: string, queryParameters, parameters) {
        if (parameters[camelCaseName] !== undefined) {
            queryParameters[name] = parameters[camelCaseName];
        }
        return queryParameters;
    }

    /**
     * Returns the api call url
     * @param {string} path - the path of the endpoint
     * @param {Object} queryParameters - the corresponding query parameters
     * @returns {string} - the complete query api call url
     */
    private getUrl(path: string, queryParameters) {

        let paramsStr = Object.keys(queryParameters).map(function(key) {
            return key + '=' + encodeURIComponent(queryParameters[key]);
        }).join('&');

        let url = paramsStr ? this.domain + path + '?' + paramsStr : this.domain + path;
        return url;
    }

    /**
     * Returns the query parameters
     * @param {Object} parameters - the api call parameters
     * @param queryParameters - the corresponding query parameters
     * @returns {Object} - the query parameters of the api call
     */
    private setQueryParameters(parameters, queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            var parameter = parameters.$queryParameters[parameterName];
            queryParameters[parameterName] = parameter;
        });
        return queryParameters;
    }

    /**
     * @method
     * @name SCApi#api_signin
     * @param {} body - user signin
     *
     */
    api_signin(parameters: {
        'body': user_signin,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/sign_in';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#api_patient_signup
     * @param {} body - patient signup
     *
     */
    api_patient_signup(parameters: {
        'body': patient_signup,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/sign_up';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_patient_profile
     *
     */

    get_patient_profile(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/view_profile';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_api_feeds
     * @param {} body - patient signup
     *
     */
    get_api_feeds(parameters: {
        //'body': api_feeds,
        'filter' ?: string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feeds';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }

        if(parameters['filter'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_api_view_about
     *
     */
    get_api_view_about(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/view_about';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#update_profile_picture
     *
     */
    update_profile_picture(parameters: {
        'photo' : any,
        'Authentication-Token': string,
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
      console.log( parameters['Authentication-Token']);

        let domain = this.domain;
        let path = '/users/update_photo';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        formData.append('photo', parameters['photo']);
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    getBioStoryAPI(parameters: {
        'bio' : any,
        'my_story':any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {

        let domain = this.domain;
        let path = '/users/edit_bio_story';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;
       

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, parameters,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    FBfeedVisibility(parameters: {
        'Authentication-Token': string,
        'visibility' : any,
        'id' : any,
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
      console.log( parameters['Authentication-Token']);
      console.log( parameters['id']);

        let domain = this.domain;
        let path = '/feeds/feed_visibility/{id}';

        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        path = path.replace(/{id}/, parameters['id']);
        formData.append('visibility', parameters['visibility']);
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    FBfeedLikeUpdate(parameters: {
        'feed_id' : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {


        let domain = this.domain;
        let path = '/feeds/{feed_id}/like';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{feed_id}/, parameters['feed_id']);
        let formData:FormData = new FormData();

        //let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Authentication-Token', parameters['Authentication-Token']);
        //headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    FBfeedUnLikeUpdate(parameters: {
        'feed_id' : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {


        let domain = this.domain;
        let path = '/feeds/{feed_id}/unlike';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        path = path.replace(/{feed_id}/, parameters['feed_id']);
        //let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Authentication-Token', parameters['Authentication-Token']);
        //headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    FBfeedDelete(parameters: {
        'id' : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
      console.log( parameters['Authentication-Token']);
      console.log( parameters['id']);

        let domain = this.domain;
        let path = '/feeds/{id}';

        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        path = path.replace(/{id}/, parameters['id']);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


     /**
     * @method
     * @name SCApi#remove_profile_picture
     *
     */
    remove_profile_picture(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
      console.log(parameters['Authentication-Token']);
        let domain = this.domain;
        let path = '/users/remove_photo';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let formData = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url,formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#update_user_profile
     *
     */
    update_user_profile(parameters: {
        'data' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
      console.log(parameters['Authentication-Token']);
        let domain = this.domain;
        let path = '/users/edit_profile';
        let body: string = "";
        let queryParameters = {};
        let url: string;

        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_api_conditions
     * @param {} body -
     *
     */
    get_api_conditions(parameters: {
        'my_condition_id' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }

        if(parameters['my_condition_id'] !== 0){
          queryParameters = this.setNonPatternTypeParameter('my_condition_id', 'my_condition_id', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#delete_myconditions
     * @param {} body -
     *
     */
    delete_myconditions(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/{condition_id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }

        path = path.replace(/{condition_id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#get_api_conditiontimeline
     * @param {} body -
     *
     */
    get_api_conditiontimeline(parameters: {
        'filter' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/list_journeys';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }

        if(parameters['filter'] !== 0){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_api_feedlike
     * @param {} body - patient signup
     *
     */
    get_api_feedlike(parameters: {
        'feed_id' ?:number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feeds/{feed_id}/users_who_liked';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        // if (parameters['body'] !== undefined) {
        //     body = JSON.stringify(parameters['body']);
        // }

        path = path.replace(/{feed_id}/, parameters['feed_id'].toString());
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


     /**
     * @method
     * @name SCApi#update_interested
     *
     */
     update_interested(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        console.log( parameters['interested_in'])
        let domain = this.domain;
        let path = '/users/edit_my_interestes';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

      
        url = this.getUrl(path, queryParameters);
        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }
       
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#update_insurance
     *
     */
    update_insurance(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/edit_my_insurance';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

       if(parameters["data"] != undefined){
           body = JSON.stringify(parameters["data"]);
       }
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_mycondition_filter
     * @param {} body -
     *
     */
    get_mycondition_filter(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/my_conditions_filter';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#list_sent_invitations
     * @param {} body -
     *
     */
    list_sent_invitations(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/list_sent_invitations';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#invite_to_care_member
     * @param {} body -
     *
     */
    invite_to_care_member(parameters: {
        'data' ? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/invite_to_care_member';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    FBaddComments(parameters: {
        'feed_id' ? : number,
        'comment'? : string,
        'tag_user_ids'? : string,
        'message'? : string,
        $queryParameters ? : {}
    }, header: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/invite_to_care_member';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData=new FormData();
        formData.append('to_name', parameters['to_name']);
        formData.append('to_email', parameters['to_email']);
        formData.append('subject', parameters['subject']);
        formData.append('message', parameters['message']);

        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
   * @method
   * @name SCApi#delete_careteam_member
   * @param {} body -
   *
   */
    delete_careteam_member(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/remove_careteam_member/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#search_mycondition
     * @param {} body -
     *
     */
    search_mycondition(parameters: {
        'searchstring' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/list_conditions/{searchstring}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


           path = path.replace(/{searchstring}/, parameters['searchstring'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#update_timeline_story
     * @param {} body -
     *
     */
    update_timeline_story(parameters: {
        'id' ? : number,
        'data' ? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/add_or_edit_timeline_experience/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_timeline_visibility
     * @param {} body -
     *
     */
    update_timeline_visibility(parameters: {
        'my_condition_id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
      console.log( parameters['visibility']);
        let domain = this.domain;
        let path = '/my_conditions/edit_timeline_visibility/{my_condition_id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{my_condition_id}/, parameters['my_condition_id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#add_new_condition
     * @param {} body -
     *
     */
    add_new_condition(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/add_journey/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());       

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    edit_new_condition(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/edit_journey/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }


        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    /**
     * @method
     * @name SCApi#manually_add_new_condition
     * @param {} body -
     *
     */
    manually_add_new_condition(parameters: {
        'name' ? : string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters !== undefined) {
            body = JSON.stringify(parameters);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#add_new_condition_profile
     * @param {} body -
     *
     */
    add_new_condition_profile(parameters: {
        'id' ? : Number
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions/add_condition/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        let formData:FormData = new FormData();        

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_Hospitalizations
     * @param {} body -
     *
     */
    get_Hospitalizations(parameters: {
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/hospitalizations';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


     /**
     * @method
     * @name SCApi#delete_Hospitalizations
     * @param {} body -
     *
     */
    delete_Hospitalizations(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/hospitalizations/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#add_Hospitalizations
     * @param {} body -
     *
     */
    add_Hospitalizations(parameters: {
        'body'? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/hospitalizations';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#edit_visibility
     * @param {} body -
     *
     */
    edit_visibility(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
      console.log( parameters['visibility']);
        let domain = this.domain;
        let path = '/hospitalizations/edit_visibility/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#usersList_TagsPurpose
     * @param {} body -
     *
     */
    usersList_TagsPurpose(parameters: {
        'search_word' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/list_tags_purpose/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{search_word}/, parameters['search_word'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);        

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_Weights
     * @param {} body -
     *
     */
    get_Weights(parameters: {
        'filter'? : string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/weights';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        /*queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);*/

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#delete_weight
     * @param {} body -
     *
     */
    delete_weight(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/weights/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#update_Hospitalizations
     * @param {} body -
     *
     */
    update_Hospitalizations(parameters: {
        'id'? : number,
        'body' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/hospitalizations/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());

         if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#search_treatment
     * @param {} body -
     *
     */
    search_treatment(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/treatments/list_treatments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


      queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
  // path = path.replace(/{search_word}/, parameters['search_word'].toString());
        // queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
     /**
     * @method
     * @name SCApi#search_treatment
     * @param {} body -
     *
     */
    search_treatmentWithOutwords( headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/my_treatments_filter?treatment_status=current';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#list_treatment_category
     * @param {} body -
     *
     */
    list_treatment_category(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/categories';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
     
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#list_all_treatments
     * @param {} body -
     *
     */
    list_all_treatments(parameters: {
        'search_word' ?: string,
        'condition_ids'?: {},
        'treatment_category_ids'?: {},
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
       
        if(parameters['search_word'] !== ''){
            queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        }
        // if(parameters['condition_ids'] !== ''){
        //     queryParameters = this.setNonPatternTypeParameter('condition_ids', 'condition_ids', queryParameters, parameters);
        // }
        // if(parameters['treatment_category_ids'] !== ''){
        //     queryParameters = this.setNonPatternTypeParameter('treatment_category_ids', 'treatment_category_ids', queryParameters, parameters);
        // }
          queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
  
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        console.log(queryParameters);
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers,
            params: {'condition_ids':parameters['condition_ids'],'treatment_category_ids':parameters['treatment_category_ids']}
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#view_treatment_with_statistics
     * @param {} body -
     *
     */
    view_treatment_with_statistics(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/view_treatment_with_statistics';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
     
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        console.log(queryParameters);
        path = path.replace(/{id}/, parameters['id'].toString());
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    

    /**
     * @method
     * @name SCApi#patient_evaluations_of_treatment
     * @param {} body -
     *
     */
    patient_evaluations_of_treatment(parameters: {
        'status' ?: string,
        'id' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/patient_evaluations_of_treatment';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
       
        if(parameters['status'] !== ''){
            queryParameters = this.setNonPatternTypeParameter('status', 'status', queryParameters, parameters);
        }
          queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
  
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        path = path.replace(/{id}/, parameters['id'].toString());
        console.log(queryParameters);
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patient_of_treatment
     * @param {} body -
     *
     */
    patient_of_treatment(parameters: {
        'id' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/patients';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
       
          queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
  
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        path = path.replace(/{id}/, parameters['id'].toString());
        console.log(queryParameters);
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#list_brands
     * @param {} body -
     *
     */
    list_brands(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/list_brands';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let requestOptionArgs = {};
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        path = path.replace(/{id}/, parameters['id'].toString());
        console.log(queryParameters);
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#add_treatment_brand
     * @param {} body -
     *
     */
    add_treatment_brand(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/add_treatment_brand';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let requestOptionArgs = {};
        if(parameters['body'] != null){
            body = JSON.stringify(parameters['body']);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };
        return this.http.post(url,  body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method get
     * @name SCApi#search_symptoms
     * @param {} body -
     *
     */
    search_symptoms(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms/list_symptoms/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{search_word}/, parameters['search_word'].toString());
      //queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#usersList_TagsPurpose
     * @param {} body -
     *
     */
    addnew_Treatment(parameters: {
        'name' ?: string,
        'Authentication-Token' ?: string
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/treatments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData=new FormData();
        formData.append('name', parameters['name']);
        let headers = new Headers();
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method post
     * @name SCApi#usersList_TagsPurpose
     * @param {} body -
     *
     */
    addnew_symptoms(parameters: {
        'name' ?: string,
        'Authentication-Token' ?: string
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData=new FormData();
        formData.append('name', parameters['name']);
        let headers = new Headers();
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#my_health_data
     * @param {} body -
     *
     */
    my_health_data(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/charts/my_health_data';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#add_Feeling
     * @param {} body -
     *
     */
    add_Feeling(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    add_Feelingnext(parameters: {
        'id' ?: number,
        'attachments' ?: any,
        'Authentication-Token' ?: string,
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        console.log(parameters['attachments'])

        path = path.replace(/{id}/, parameters['id'].toString());

        let formData:FormData = new FormData();

        if(parameters['attachments'].length>0){
          for (let items of parameters['attachments']){
            formData.append('attachments[][attachment]', items);
          }
        }

        let headers = new Headers();
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    sendCommentFeeds(parameters: {
        'feed_id' ?: number,
        'attachments' ?: any,
        'comment' ?: string,
        'tag_user_ids' ?: string,
        'Authentication-Token' ?: string,
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feed_comments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        console.log(parameters['attachments'])

        let formData:FormData = new FormData();
         formData.append("feed_id",parameters['feed_id'].toString());
          formData.append("comment", parameters['comment']);
          formData.append("tag_user_ids",parameters['tag_user_ids']);
        if(parameters['attachments'].length>0){
          for (let items of parameters['attachments']){
            formData.append('attachments[][attachment]', items);
          }
        }

        let headers = new Headers();
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#search_taguser
     * @param {} body -
     *
     */
    search_taguser(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings/list_users/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{search_word}/, parameters['search_word']);
        // queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#get_feelings
     * @param {} body - patient signup
     *
     */
    get_feelings(parameters: {
        'filter' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['filter'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };




    /**
     * @method
     * @name SCApi#delete_feeling
     * @param {} body -
     *
     */
    delete_feeling(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_feelings
     * @param {} body - patient signup
     *
     */
    update_feelings(parameters: {
        'id' ?: number,
        'data' ? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feelings/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());

        if(parameters['data'] !== ''){
          body = JSON.stringify(parameters["data"]);
        }
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#search_lab
     * @param {} body -
     *
     */
    search_lab(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/list_labs_tests_suggestions/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        //queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        path = path.replace(/{search_word}/, parameters['search_word'].toString());
        // queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#addlab_Result
     * @param {} body -
     *
     */
    addlab_Result(parameters: {
        'id' ? : number,
        'data'? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/create_result/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{id}/, parameters['id'].toString());

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }       
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


     /**
     * @method
     * @name SCApi#addlab_UpdateResult
     * @param {} body -
     *
     */
    addlab_UpdateResult(parameters: {
        'id' ? : number,
        'data'? :any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/edit_result/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{id}/, parameters['id'].toString());
        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#addlab_Name
     * @param {} body -
     *
     */
    addlab_Name(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }       

        // queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_labstest
     * @param {} body - patient signup
     *
     */
    get_Comments(parameters: {
        'id' ?: number,
        'filter' ?: string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feed_comments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        queryParameters = this.setNonPatternTypeParameter('id', 'id', queryParameters, parameters);
        if(parameters['filter'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    get_labstest(parameters: {
        'filter' ?: string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/my_labs_tests';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['filter'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
     * @method
     * @name SCApi#addlab_ourprofile
     * @param {} body -
     *
     */
    addlab_ourprofile(parameters: {
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/add_labs_tests/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, null, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#delete_labTest
     * @param {} body -
     *
     */
    delete_labTest(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/remove_labs_tests/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#delete_labTestResult
     * @param {} body -
     *
     */
    delete_labTestResult(parameters: {
        'id' ?: number,
        'my_labs_test_id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/labs_tests/delete_result/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('my_labs_test_id', 'my_labs_test_id', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    Delete_FeedComments(parameters: {
        'id' ?: number,
        'feed_id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/feed_comments/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('feed_id', 'feed_id', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#addtreatment_ourprofile
     * @param {} body -
     *
     */
    addtreatment_ourprofile(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{id}/, parameters['id'].toString());

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data'])
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        let formData:FormData = new FormData();
        formData.append("require_dosage", parameters['require_dosage']);

      
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



  /**
   * @method
   * @name SCApi#get_treatmentlist
   * @param {} body -
   *
   */
    get_treatmentlist(parameters: {
        'my_treatment_id' ?: string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'treatment_status' ?: string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['my_treatment_id'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('my_treatment_id', 'my_treatment_id', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('treatment_status', 'treatment_status', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
   * @method
   * @name SCApi#get_treatmentfilterlist
   * @param {} body -
   *
   */
    get_treatmentfilterlist(parameters: {
        'treatment_status' ?: string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/my_treatments_filter';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('treatment_status', 'treatment_status', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


      /**
     * @method
     * @name SCApi#addschedule_treatment
     * @param {} body -
     *
     */
    addschedule_treatment(parameters: {
        'id' ? : number,
        'body' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/add_dosage_or_schedule/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        console.log(parameters['id']);
        console.log(parameters['body']);

         path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };
        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

      /**
     * @method
     * @name SCApi#addschedule_treatment
     * @param {} body -
     *
     */
    updateschedule_treatment(parameters: {
        'id' ? : number,
        'body' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/edit_dosage_or_schedule/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        console.log(parameters['id']);
        console.log(parameters['body']);

         path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#addevaluation_treatment
     * @param {} body -
     *
     */
    addevaluation_treatment(parameters: {
        'id' ? : number,
        'body' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/add_evaluation/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        console.log(parameters['id']);
        console.log(parameters['body']);

         path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#updateevaluation_treatment
     * @param {} body -
     *
     */
    updateevaluation_treatment(parameters: {
        'id' ? : number,
        'body' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/edit_evaluation/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        console.log(parameters['id']);
        console.log(parameters['body']);

         path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#delete_evaluation
     * @param {} body -
     *
     */
    delete_evaluation(parameters: {
        'id' ?: number,
        'evalution_id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/delete_evaluation/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('evalution_id', 'evalution_id', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#delete_dosageSchedule
     * @param {} body -
     *
     */
    delete_dosageSchedule(parameters: {
        'id' ?: number,
        'dosage_or_schedule_id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/delete_dosage_or_schedule/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('dosage_or_schedule_id', 'dosage_or_schedule_id', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#delete_treatment
     * @param {} body -
     *
     */
    delete_treatment(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#edit_visibility_dosage_or_schedule
     * @param {} body -
     *
     */
    edit_visibility_dosage_or_schedule(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/edit_visibility_dosage_or_schedule/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#edit_visibility_dosage_or_schedule
     * @param {} body -
     *
     */
    edit_visibility_evaluation(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/edit_visibility_evaluation/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#edit_visibility_dosage_or_schedule
     * @param {} body -
     *
     */
    start_stop_treatment(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/start_stop_treatment/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#edit_visibility_dosage_or_schedule
     * @param {} body -
     *
     */
    add_purpose(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/add_purpose/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#edit_visibility_dosage_or_schedule
     * @param {} body -
     *
     */
    remove_purpose(parameters: {
        'id' ? : number,
        'purpose_id' ? : number,
        'purpose_type' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_treatments/remove_purpose/{id}';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('purpose_id', 'purpose_id', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('purpose_type', 'purpose_type', queryParameters, parameters);

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
   * @method
   * @name SCApi#doctor_visit_chart
   * @param {} body -
   *
  */
    doctor_visit_chart(parameters: {
        'feeling_filter' ?: string,
        'qol_survey_filter' ?: string,
        'my_treatment_filter' ?: string,
        'my_symptom_filter' ?: string,
        'my_hospitalization_filter' ?: string,
        'my_weight_filter' ?: string,
        // 'evalution_id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/charts';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
       // path = path.replace(/{id}/, parameters['id'].toString());

         if(parameters['feeling_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('feeling_filter', 'feeling_filter', queryParameters, parameters);
         }
         if(parameters['qol_survey_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('qol_survey_filter', 'qol_survey_filter', queryParameters, parameters);
         }
         if(parameters['my_treatment_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('my_treatment_filter', 'my_treatment_filter', queryParameters, parameters);
         }
         if(parameters['my_symptom_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('my_symptom_filter', 'my_symptom_filter', queryParameters, parameters);
         }
         if(parameters['my_hospitalization_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('my_hospitalization_filter', 'my_hospitalization_filter', queryParameters, parameters);
         }
         if(parameters['my_weight_filter']!=""){
            queryParameters = this.setNonPatternTypeParameter('my_weight_filter', 'my_weight_filter', queryParameters, parameters);
         }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_doctor_visit_sheets
     *
     */
    get_doctor_visit_sheets(parameters: {
        'search_word' ?: string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/charts/doctor_visit_sheets';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['search_word'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
   * @method
   * @name SCApi#delete_doctorsavesheet
   * @param {} body -
   *
   */
    delete_doctorsavesheet(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/charts/remove_doctor_visit_sheet';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        //path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('id', 'id', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };





    /**
   * @method
   * @name SCApi#qol_List
   * @param {} body -
   *
   */
    qol_List(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/quality_of_life_scores/list_qols';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };




    /**
     * @method
     * @name SCApi#api_addqol
     * @param {} body
     *
     */
    api_addqol(parameters: {
        'body': any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/quality_of_life_scores';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#get_qol_scorelist
     *
     */
    get_qol_scorelist(parameters: {
        'filter' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/quality_of_life_scores';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if(parameters['filter'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        }
        /*queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);*/

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_qol_visibility
     * @param {} body -
     *
     */
    update_qol_visibility(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/quality_of_life_scores/edit_qol_score_visibility/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        //let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



     /**
   * @method
   * @name SCApi#delete_qolserveys
   * @param {} body -
   *
   */
    delete_qolserveys(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/quality_of_life_scores/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#get_conditionslist_symptom
     * @param {} body -
     *
     */
    get_conditionslist_symptom(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_conditions';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

         if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#api_addweight
     * @param {} body
     *
     */
    api_addweight(parameters: {
        'body': any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/weights';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#api_addweight
     * @param {} body
     *
     */
    api_updateweight(parameters: {
        'id' ?: number;
        'body': any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/weights/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
         path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.put(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };






    /**
     * @method
     * @name SCApi#get_calculate
     *
     */
    get_calculate(parameters: {
        'measurement_system' ?: string,
        'weight_lbs' ? : number,
        'height_ft' ?: number,
        'height_in' ? : number,
        'weight_kg' ? : number,
        'height_cm' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/calculate_bmi';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        queryParameters = this.setNonPatternTypeParameter('measurement_system', 'measurement_system', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('weight_lbs', 'weight_lbs', queryParameters, parameters);


        if (parameters['height_ft'] !== undefined) {
            queryParameters = this.setNonPatternTypeParameter('height_ft', 'height_ft', queryParameters, parameters);
        }
        if (parameters['height_in'] !== undefined) {
            queryParameters = this.setNonPatternTypeParameter('height_in', 'height_in', queryParameters, parameters);
        }
        if (parameters['weight_kg'] !== undefined) {
            queryParameters = this.setNonPatternTypeParameter('weight_kg', 'weight_kg', queryParameters, parameters);
        }
        if (parameters['height_cm'] !== undefined) {
            queryParameters = this.setNonPatternTypeParameter('height_cm', 'height_cm', queryParameters, parameters);
        }
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#update_visibility
     *
     */
    update_visibility(parameters: {
        'visibility' ?: any,
        'Authentication-Token' ?: string,
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/weights/update_all_weights_visibility';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        let formData:FormData = new FormData();
        formData.append('visibility', parameters['visibility']);
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };




    /**
     * @method
     * @name SCApi#symptom_addourprofile
     *
     */
    symptom_addourprofile(parameters: {
        'id' : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/add_symptom/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        path = path.replace(/{id}/, parameters['id'].toString());
      
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#addNewsymptom
     *
     */
    addNewsymptom(parameters: {
        'id' ?: number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/add_condition_to_symptom/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());      

        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#symptomtrackinglist
     *
     */
    symptomtrackinglist(parameters: {
        'date_sort' ?: string,
        'is_tracking': boolean,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/my_symptoms';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('date_sort', 'date_sort', queryParameters, parameters);
         queryParameters = this.setNonPatternTypeParameter('is_tracking', 'is_tracking', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };




     /**
     * @method
     * @name SCApi#delete_symptom
     * @param {} body -
     *
     */
    delete_symptom(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/remove_symptom/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
   * @method
   * @name SCApi#add_symptom_treatment_side_effect
   * @param {} body -
   *
   */
    add_symptom_treatment_side_effect(parameters: {
        'id' ?: number,
        'data' ?: any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/add_symptom_treatment_side_effect/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());
        
        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

  /**
   * @method
   * @name SCApi#add_symptom_treatment
   * @param {} body -
   *
   */
    add_symptom_treatment(parameters: {
        'id' ?: number,
        'treatment_id' ?: number,
        'Authentication-Token' ?: string
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/add_symptom_treatment/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());

        let formData:FormData = new FormData();
        formData.append('treatment_id', parameters['treatment_id'].toString());
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
   * @method
   * @name SCApi#remove_symptom_treatment
   * @param {} body -
   *
   */
    remove_symptom_treatment(parameters: {
        'id' ?: number,
        'treatment_id' ?: number,
       // 'Authentication-Token' ?: string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/remove_symptom_treatment/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('treatment_id', 'treatment_id', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


  /**
   * @method
   * @name SCApi#remove_symptom_treatment
   * @param {} body -
   *
   */
    remove_sideeffect_treatment(parameters: {
        'id' ?: number,
        'treatment_id' ?: number,
       // 'Authentication-Token' ?: string
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/remove_symptom_treatment_side_effect/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('treatment_id', 'treatment_id', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#delete_symptom
     * @param {} body -
     *
     */
    start_stop_monitoring(parameters: {
        'id' ?: number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/start_stop_monitoring/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };



    /**
     * @method
     * @name SCApi#delete_symptom
     * @param {} body -
     *
     */
    get_symptoms(parameters: {
        'id' ?: number,
        'from_date' ? : any,
        'end_date' ? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        queryParameters = this.setNonPatternTypeParameter('from_date', 'from_date', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('end_date', 'end_date', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method POST /api/v1/users/sign_up_physician_researcher
     * @name SCApi#api_researcher_signup
     * @param {} body - researchersignup
     *
     */
    api_researcher_signup(parameters: {
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/sign_up_physician_researcher';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        for (let items in parameters){
            if (items == 'attachments'){
                for(let upload in parameters[items]){
                    if(parameters[items][upload].is_upload == true){
                        formData.append('attachments[][attachment]', parameters[items][upload].file, parameters[items][upload].file.name);
                        formData.append('attachments[][visibility]', parameters[items][upload].visibility);
                    }
                }
            } else {
                formData.append(items, parameters[items]);
            }
        }
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.delete('content-type');

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/users/sign_up_physician_researcher
     * @name SCApi#api_physician_signup
     * @param {} body - physician signup
     *
     */
    api_physician_signup(parameters: {
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/sign_up_physician_researcher';
        //let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        for (let items in parameters){
            if (items == 'attachments'){
                for(let upload in parameters[items]){
                    if(parameters[items][upload].is_upload == true){
                        formData.append('attachments[][attachment]', parameters[items][upload].file, parameters[items][upload].file.name);
                        formData.append('attachments[][visibility]', parameters[items][upload].visibility);
                    }
                }
            } else if(items == 'degree' || items == 'license'){
                formData.append(items, parameters[items], parameters[items].name);
            } else {
                formData.append(items, parameters[items]);
            }
        }

        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        //headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/degrees/{search_word}
     * @name SCApi#search_degrees
     * @param {} body -
     *
     */
    search_degrees(parameters: {
        'searchDegreeKeyword' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/degrees/{searchDegreeKeyword}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        path = path.replace(/{searchDegreeKeyword}/, parameters['searchDegreeKeyword'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/degrees
     * @name SCApi#post_degrees
     * @param {} body - degree entered during signup with no mathces in searchword
     *
     */
    post_degrees(parameters: {
        'body': post_degree_signup,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/degrees';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/currently_practicing/{search_word}
     * @name SCApi#search_currently_practicing
     * @param {} body -
     *
     */
    search_currently_practicing(parameters: {
        'searchPracticeKeyword' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/currently_practicing/{searchPracticeKeyword}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;


        path = path.replace(/{searchPracticeKeyword}/, parameters['searchPracticeKeyword'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/currently_practicing
     * @name SCApi#post_currently_practicing
     * @param {} body - practice entered during signup with no mathces in searchword
     *
     */
    post_currently_practicing(parameters: {
        'body': post_practice_signup,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/currently_practicing';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }


    /**
     * @method
     * @name SCApi#update_Multiplesymptoms
     * @param {} body -
     *
     */
    update_Multiplesymptoms(parameters: {
        'body'? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptoms/add_multiple_severities';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/users/view_profile_physician_researcher
     * @name SCApi#get_profile_physician_researcher
     *
     */

    get_profile_physician_researcher(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/view_profile_physician_researcher';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_forumThread_reply
     * @param {} body -
     *
     */
    get_forum_thread_reply(parameters: {
        'id' : number
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_threads/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#createForumThreadsreply
     * @param {} body -
     *
     */
    addForumThreadComment(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_thread_replies';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


     /**
     * @method PATCH /api/v1/users/edit_profile_physician_researcher
     * @name SCApi#update_physician_researcher
     *
     */
    update_physician_researcher(parameters: {
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/edit_profile_physician_researcher';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        for (let items in parameters){
            
            if (items == 'attachments'){
                for(let upload in parameters[items]){
                    if(parameters[items][upload].is_upload == true){
                        formData.append('attachments[][attachment]', parameters[items][upload].file, parameters[items][upload].file.name);
                        formData.append('attachments[][visibility]', parameters[items][upload].visibility);
                    }
                }
            } else {
                formData.append(items, parameters[items]);
            }
        }
        formData.append(parameters.$queryParameters, parameters.$queryParameters);
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };
        return this.http.patch(url, formData, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

         /**
     * @method
     * @name SCApi#list_get_researchers
     * @param {} body -
     *
     */
    getPatients(parameters: {
        "condition_id":any,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'filter'?:string,
        'sort_by'?:string,
        'name'?:string,
        'agerange'?:string,
        'gender'?:string,
        'gender_identity'?:string,
        'interests'?:any,
        'symptom_ids'?:any,
        'country_code'?:string,
        'city_states'?:any,
        'treatment_ids':any
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/patients?{agerange}{treatment_ids}{symptom_ids}{name}{gender}{country_code}{city_states}{gender_identity}{interests}sort_by={sort_by}&page={page}&per_page={per_page}&offset={offset}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let city_statesPath="";
        let requestOptionArgs = {};
        let temp="";
        let temp1="";
        let conditiontemp="";
        if(parameters["treatment_ids"] !== null ){
            for(var i=0;i<parameters["treatment_ids"].length;i++){
               temp=temp+"treatment_ids[]="+parameters["treatment_ids"][i].id+"&";
            }
            path = path.replace(/{treatment_ids}/, temp);
        }else{
            path = path.replace(/{treatment_ids}/, "")
        }
        if(parameters["symptom_ids"] !== null ){
            for(var i=0;i<parameters["symptom_ids"].length;i++){
                temp1=temp1+"symptom_ids[]="+parameters["symptom_ids"][i].id+"&";
            }
            path = path.replace(/{symptom_ids}/, temp1);
        }else{
            path = path.replace(/{symptom_ids}/, "")
        }
        if(parameters["country_code"] !== null && parameters["city_states"] !== null ){
            for(var i=0;i<parameters["city_states"].length;i++){
                city_statesPath=city_statesPath+"city_states[]="+parameters["city_states"][i]+"&";
            }
            path = path.replace(/{city_states}/, city_statesPath);
            path = path.replace(/{country_code}/, "country_code="+parameters['country_code']+"&");
        }else{
            path = path.replace(/{country_code}/, "");
            path = path.replace(/{city_states}/, "")
        }
        if(parameters["name"] !== null){
            path = path.replace(/{name}/, "name="+parameters['name']+"&")
        }else{
            path = path.replace(/{name}/, "")
        }
        if(parameters["agerange"] !== null){
            path = path.replace(/{agerange}/, "age="+parameters['agerange']+"&")
        }else{
            path = path.replace(/{agerange}/, "")
        }
        if(parameters["gender"] !== null){
            path = path.replace(/{gender}/, "gender="+parameters['gender']+"&")
        }else{
            path = path.replace(/{gender}/, "")
        }
        if(parameters["gender_identity"] !== null){
            path = path.replace(/{gender_identity}/, "gender_identity="+parameters['gender_identity']+"&")
        }else{
            path = path.replace(/{gender_identity}/, "")
        }
        if(parameters["interests"] != null){
            path = path.replace(/{interests}/, "interests="+parameters["interests"]+"&")                                              
        }else{
            path = path.replace(/{interests}/, "")
        }
        path = path.replace(/{sort_by}/, parameters['sort_by'])
                   .replace(/{per_page}/, parameters['per_page'].toString())
                   .replace(/{page}/, parameters['page'].toString())
                   .replace(/{offset}/, parameters['offset'].toString());

        url = this.getUrl(path, queryParameters);
        if(parameters["condition_id"] !== null){
            requestOptionArgs = {
                headers: headers,
                params: {"condition_id":parameters['condition_id']}
            };
        }else{
            requestOptionArgs = {
                headers: headers
            };
        }


        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

         /**
     * @method
     * @name SCApi# currently_practicings
     * @param {} body -
     *
     */
    getcurrently_practicings(parameters: {
        'search_word'?:string,
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/currently_practicing/{search_word}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let city_statesPath="";
        let requestOptionArgs = {};
        path = path.replace(/{search_word}/, parameters['search_word']);

        url = this.getUrl(path, queryParameters);
        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


            /**
     * @method
     * @name SCApi# get Degrees
     * @param {} body -
     *
     */
    getDegrees(parameters: {
        'search_word'?:string,
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/degrees/{search_word}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let city_statesPath="";
        let requestOptionArgs = {};
        path = path.replace(/{search_word}/, parameters['search_word']);

        url = this.getUrl(path, queryParameters);
        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    

         /**
     * @method
     * @name SCApi#list_get_researchers
     * @param {} body -
     *
     */
    getphysicians(parameters: {
        'country_code'?:string,
        'city_states'?:any,
        "degree_earned_ids":any,
         "type_of_physician_ids":any,
        'name'?:string,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'sort_by'?:string,
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/physicians?{degree_earned_ids}{type_of_physician_ids}{country_code}{city_states}{name}sort_by={sort_by}&page={page}&per_page={per_page}&offset={offset}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
        let temp="";
        let tempdegree="";
        let requestOptionArgs = {};
        let city_statesPath="";
        if(parameters["type_of_physician_ids"] !== null ){
            for(var i=0;i<parameters["type_of_physician_ids"].length;i++){
               temp=temp+"type_of_physician_ids[]="+parameters["type_of_physician_ids"][i].id+"&";
            }
            path = path.replace(/{type_of_physician_ids}/, temp);
        }else{
            path = path.replace(/{type_of_physician_ids}/, "")
        }
        if(parameters["country_code"] !== null && parameters["city_states"] !== null ){
            for(var i=0;i<parameters["city_states"].length;i++){
                city_statesPath=city_statesPath+"city_states[]="+parameters["city_states"][i]+"&";
            }
            path = path.replace(/{city_states}/, city_statesPath);
            path = path.replace(/{country_code}/, "country_code="+parameters['country_code']+"&");
        }else{
            path = path.replace(/{country_code}/, "");
            path = path.replace(/{city_states}/, "")
        }
        if(parameters["degree_earned_ids"] !== null ){
            for(var i=0;i<parameters["degree_earned_ids"].length;i++){
               tempdegree=tempdegree+"degree_earned_ids[]="+parameters["degree_earned_ids"][i].id+"&";
            }
            path = path.replace(/{degree_earned_ids}/, tempdegree);
        }else{
            path = path.replace(/{degree_earned_ids}/, "")
        }
        if(parameters["name"] !== null){
            path = path.replace(/{name}/, "name="+parameters['name']+"&")
        }else{
            path = path.replace(/{name}/, "")
        }
        path = path.replace(/{sort_by}/, parameters['sort_by'])
                   .replace(/{per_page}/, parameters['per_page'].toString())
                   .replace(/{page}/, parameters['page'].toString())
                   .replace(/{offset}/, parameters['offset'].toString());

        url = this.getUrl(path, queryParameters);
        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    
    /**
     * @method
     * @name SCApi#deleteForumThreads
     * @param {} id -
     *
     */
    delete_forum_threads(parameters: {
        'id' : number
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_threads/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{id}/, parameters['id'].toString());
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#get_forumslist
     * @param {} body -
     *
     */
    get_forum_threads(parameters: {
        'forum_id' : number,
        'search_word' ? : string
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        //let path = '/forum_threads?forum_id={id}';
        let path = '/forum_threads';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        //path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('forum_id', 'forum_id', queryParameters, parameters);
        if(parameters['search_word'] !== ''){
          queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#createForumThreads
     * @param {} body -
     *
     */
    create_forum_threads(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_threads';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


      /**
     * @method
     * @name SCApi#get_tagUsrList
     * @param {} body -
     *
     */
    get_tag_userlist(parameters: {
        'searchString' : String
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_threads/list_users/{searchString}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{searchString}/, parameters['searchString'].toString());
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#get_forumThread_reply
     * @param {} body -
     *
     */
    delete_forum_thread_reply(parameters: {
        'id' : number,
        'forum_post_id':number
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_thread_replies/{forum_post_id}?forum_post_id={id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString()).replace(/{forum_post_id}/, parameters['forum_post_id'].toString());
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_forumslist
     * @param {} body -
     *
     */
    get_forums(parameters: {
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forums';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

 /**
     * @method
     * @name SCApi#edit_forumThread_reply
     * @param {} body -
     *
     */
    edit_forum_thread_reply(parameters: {
        'comment' : String,
        'forum_post_id':number
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forum_thread_replies/{forum_post_id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{forum_post_id}/, parameters['forum_post_id'].toString());
        body = JSON.stringify({'comment':parameters['comment'].toString() });
        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url,body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    get_forums_category (headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/forums';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    
    /**
     * @method POST /api/v1/users/reset_password
     * @name SCApi#post_reset_password
     * @param {} body - practice entered during signup with no mathces in searchword
     *
     */
    post_reset_password(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/reset_password';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, parameters, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }

    /**
     * @method PATCH /api/v1/users/edit_profile_physician_researcher
     * @name SCApi#update_physician_researcher_visibility_atttachment
     *
    */

    update_physician_researcher_visibility_atttachment(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/edit_profile_physician_researcher';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };
        
        return this.http.patch(url, body,requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/users/search_conditions_tag
     * @name SCApi#search_conditions_tag
     * @param {} body -
     *
     */
    search_conditions_tag(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/search_conditions_tag';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#add_new_tag_profile
     * @param {} body -
     *
     */
    add_new_tag_profile(parameters: {
        'id' ? : Number,
        'Authentication-Token' ? : string
        $queryParameters ? : {}
    }, token: Headers): Observable < any > {
        console.log(parameters['Authentication-Token']);
        let domain = this.domain;
        let path = '/users/tag_condition/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        let formData:FormData = new FormData();
        let headers = new Headers();
        /** No need to include Content-Type in Angular 4 */

        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url,formData,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method DELETE /api/v1/users/remove_tag/{id}
     * @name SCApi#remove_tag
     * @param {} body -
     *
     */
    remove_tag(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/remove_tag/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /*
     *
     * PUBLICATION API GOES HERE
     *
     */

     /**
     * @method
     * @name SCApi#get_publications
     * @param {} body -
     *
     */
    get_publications(parameters: {
        'query'? : string,
        'filter'? : string,
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/publications';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        queryParameters = this.setNonPatternTypeParameter('query', 'query', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/publications/my_publications
     * @name SCApi#get_my_publications
     *
     */

    get_my_publications(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/publications/my_publications';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/publications
     * @name SCApi#post_publication
     * @param {} 
     *
     */
    post_publication(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/publications';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }

    /**
     * @method PATCH /api/v1/publications/{id}
     * @name SCApi#edit_publication
     *
    */

    edit_publication(parameters: {
        'id' ? : any,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/publications/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        let formData:FormData = new FormData();
        path = path.replace(/{id}/, parameters['id']);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }
        
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method DELETE /api/v1/publications/{id}
     * @name SCApi#delete_publication
     *
    */

    delete_publication(parameters: {
        'id' : number,
        'delete_type': number
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        console.log(parameters);
        let domain = this.domain;
        let path = '/publications/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('delete_type', 'delete_type', queryParameters, parameters);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method GET /api/v1/users/list_tags_purpose/{search_word}
     * @name SCApi#list_tags_purpose
     * @param {} body -
     *
     */
    list_tags_purpose(parameters: {
        'search_word' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/list_tags_purpose/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{search_word}/, parameters['search_word']);
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/users/sign_in_with_facebook
     * @name SCApi#sign_in_with_facebook
     * @param {} 
     *
     */
    sign_in_with_facebook(parameters: {
        'body' ? : any,
        $queryParameters ? : {}
    }): Observable < any > {
        let domain = this.domain;
        let path = '/users/sign_in_with_facebook';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        let headers = new Headers();
        headers.append('content-type', 'application/json');
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#list_symptomconditionsIds
     * @param {} body -
     *
     */
    my_symptomconditions_listIds(headers: Headers): Observable < any > {
       
        let path = '/my_conditions/my_conditions_filter';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
    
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#list_get_researchers
     * @param {} body -
     *
     */
    getResearchers(parameters: {
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'filter'?:string,
        'sort_by'?:string,
        'name'?:string
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/researchers?{name}filter={filter}&sort_by={sort_by}&page={page}&per_page={per_page}&offset={offset}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
    
        if(parameters["name"] !== null){
            path = path.replace(/{name}/, "name="+parameters['name']+"&")
        }else{
            path = path.replace(/{name}/, "")
        }
        path = path.replace(/{filter}/, parameters['filter'])
                   .replace(/{sort_by}/, parameters['sort_by'])
                   .replace(/{per_page}/, parameters['per_page'].toString())
                   .replace(/{page}/, parameters['page'].toString())
                   .replace(/{offset}/, parameters['offset'].toString());

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
     /**
     * @method
     * @name SCApi#list_get_researchers
     * @param {} body -
     *
     */
    getUserFollowing(parameters: {
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/follows/user_following?page={page}&per_page={per_page}&offset={offset}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
    
        path = path.replace(/{per_page}/, parameters['per_page'].toString())
                   .replace(/{page}/, parameters['page'].toString())
                   .replace(/{offset}/, parameters['offset'].toString());

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#getUserfollowers
     * @param {} body -
     *
     */
    getUserfollowers(parameters: {
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/follows/user_followers?page={page}&per_page={per_page}&offset={offset}';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
    
        path = path.replace(/{per_page}/, parameters['per_page'].toString())
                   .replace(/{page}/, parameters['page'].toString())
                   .replace(/{offset}/, parameters['offset'].toString());

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    
    /**
     * @method
     * @name SCApi#get_HeaderSymptoms
     * @param {} body -
     *
     */
    get_CommunitySymptoms(parameters: {
        'condition_ids'?: {},
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        'search_word'?:string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms/';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        if(parameters['search_word'].length>0){
            queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);
        }
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers,
            params: {'condition_ids':parameters['condition_ids']}
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    get_message_notification(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages/unread/notifications';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    //FAQS
    /**
     * @method POST /api/v1/submit_a_request
     * @name SCApi#submit_a_request
     * @param {} 
     *
     */
    post_faqs(parameters: {
        'data' ? : any;
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/faqs/submit_a_request';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }

    /**
     * @method
     * @name SCApi#faqs
     * @param {}
     *
     */
    get_faqs(parameters: {
        'search_word'? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/faqs';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let paramsStr: string;
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/create_a_ticket
     * @name SCApi#create_a_ticket
     * @param {} 
     *
     */
    create_a_ticket(parameters: {
        'data' ? : any;
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/faqs/create_a_ticket';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }

    getPageDetails(parameters: {
        'slag_name' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/pages';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('slag_name', 'slag_name', queryParameters, parameters);
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/create_a_ticket
     * @name SCApi#create_a_ticket
     * @param {} 
     *
     */
    request_advertise(parameters: {
        'data' ? : any;
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/request_advertise';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    }

    send_to_admin(parameters: {
        'reason' ?: string,
        'user_id' ? : number
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages/send_to_admin/{user_id}';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{user_id}/, parameters['user_id'].toString());

        if(parameters["reason"] != undefined && parameters["reason"] != ''){
            queryParameters = this.setNonPatternTypeParameter('reason', 'reason', queryParameters, parameters);
        }        
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    delete_messages_or_conversation(parameters: {
        'to_user_id' ?: number,
        'message_ids' ? : any
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages/delete_messages_or_conversation';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('to_user_id', 'to_user_id', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('message_ids', 'message_ids', queryParameters, parameters);
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    send_message(parameters: {
        'Authentication-Token' ?: string,
        'to_user_id' ?: number,
        'body' ?: string,
        'attachment' ?: any
        $queryParameters ? : {}
    }): Observable < any > {
        let domain = this.domain;
        let path = '/messages/send_message';
        let queryParameters = {};
        let url: string;
        let body: string = "";
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        let formData=new FormData();
        formData.append('to_user_id', parameters['to_user_id'].toString());
        formData.append('body', parameters['body']);
        if(parameters['attachment'] != undefined){
            formData.append('attachment', parameters['attachment']);    
        }
                
        let headers = new Headers();
        headers.append('Authentication-Token', parameters['Authentication-Token']);
        headers.delete('content-type');        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, formData, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    list_users(parameters: {
        'search_word' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages/list_users/{search_word}';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{search_word}/, parameters['search_word'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    list_conversion(parameters: {
        'filter' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('filter', 'filter', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    get_user_conversation(parameters: {
        'to_user_id' ?: string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/messages/{to_user_id}';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        path = path.replace(/{to_user_id}/, parameters['to_user_id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        
        url = this.getUrl(path, queryParameters);
        
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs).map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    get_CommunitySymptom(parameters: {
        'id' : number,        
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;
        path = path.replace(/{id}/, parameters['id'].toString());
        //queryParameters = this.setNonPatternTypeParameter('id', 'id', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
    
    /**
     * @method
     * @name SCApi#get_SymptomTreatments
     * @param {} body -
     *
     */
    get_SymptomTreatments(parameters: {
        'id' ? : number,
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms/{id}/treatments';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('id', 'id', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };   

    /**
     * @method
     * @name SCApi#get_SymptomPatients
     * @param {} body -
     *
     */
    get_SymptomPatients(parameters: {
        'id' ? : number,
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/symptoms/{id}/patients';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('id', 'id', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#follow_User
     * @param {} body -
     *
     */
    follow_User(parameters: {
        'body' ?: any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/follows';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['body'] !== undefined) {
            body = JSON.stringify(parameters['body']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
     /**
     * @method
     * @name SCApi#follow_User
     * @param {} body -
     *
     */
    unfollow_User(parameters: {
      'follower_id': number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/follows?following_id={follower_id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{follower_id}/, parameters['follower_id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#my_symptom_severities
     *
     */
    remove_symptom_severities(parameters: {
        'my_symptom_id' ? : number,
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptom_severities/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let formData = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        queryParameters = this.setNonPatternTypeParameter('my_symptom_id', 'my_symptom_id', queryParameters, parameters);
        path = path.replace(/{id}/, parameters['id'].toString());

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url,requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

     /**
     * @method
     * @name SCApi#edit_visibility
     *
     */
    sevirity_edit_visibility(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptom_severities/edit_visibility/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let formData = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_sevirity
     *
     */
    update_sevirity(parameters: {
        'id' ? : number,
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptom_severities/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let formData = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.put(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_sevirity
     *
     */
    add_sevirity(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/my_symptom_severities';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#create_doctor_visit_sheet
     *
     */
    createDoctorVisitSheet(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/charts/create_doctor_visit_sheet';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        if(parameters['data'] != undefined){
            body = JSON.stringify(parameters['data']);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method POST /api/v1/follows
     * @name SCApi#/v1/follows
     * @param {} 
     *
     */

    follows(parameters: {
        'follower_id' : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/follows';
        let body = [];
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters['follower_id'] !== undefined) {
            body['follower_id'] = parameters['follower_id'];
        }
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
       // console.log('body',body);
        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, parameters, requestOptionArgs)
        .map(res => {
            return {
                body: res.json(),
                headers: res.headers,
            }
        })
        .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_current_past_treatment
     * @param {} body -
     *
     */
    patients_current_past_treatment(parameters: {
        'id' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'current_past_treatment' ? : boolean,
        'duration' ? :string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/patients_current_past_treatment';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
       
          queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('current_past_treatment', 'current_past_treatment', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('duration', 'duration', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        path = path.replace(/{id}/, parameters['id'].toString());
        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_evaluations
     * @param {} body -
     *
     */
    patients_evaluations(parameters: {
        'id' ?: number,
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'evalaution' ? : string,
        'evalaution_kind' ? :string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
       
        let path = '/treatments/{id}/patients_evaluations';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};
       
          queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('evalaution', 'evalaution', queryParameters, parameters);
          queryParameters = this.setNonPatternTypeParameter('evalaution_kind', 'evalaution_kind', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        path = path.replace(/{id}/, parameters['id'].toString());
        
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#change_email
     * @param {} body - user signin
     *
     */
    change_email(parameters: {
       'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/change_email';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#change_password
     * @param {} body - user signin
     *
     */
    change_password(parameters: {
       'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/change_password';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_timezone
     * @param {} body - user signin
     *
     */
    update_timezone(parameters: {
       'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/update_timezone';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_timezone
     * @param {} body - user signin
     *
     */
    view_timezone(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/view_timezone';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_accessibility_setting
     * @param {} body - user signin
     *
     */
    update_accessibility_setting(parameters: {
       'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/update_accessibility_setting';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_accessibility_setting
     * @param {} body - user signin
     *
     */
    view_accessibility_setting(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/view_accessibility_setting';
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };


    /**
     * @method
     * @name SCApi#hide_my_profile
     * @param {} body - user signin
     *
     */
    hide_my_profile(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/hide_my_profile';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_hide_my_profile
     * @param {} body - user signin
     *
     */
    view_hide_my_profile(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/view_hide_my_profile';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#deactivate_my_account
     * @param {} body - user signin
     *
     */
    deactivate_my_account(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/deactivate_my_account';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, null, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_email_setting
     * @param {} body - user signin
     *
     */
    update_email_setting(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/update_email_setting';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_email_setting
     * @param {}
     */
    view_email_setting(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/view_email_setting';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };
        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#update_reminder_setting
     * @param {} body - user signin
     *
     */
    update_reminder_setting(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/update_reminder_setting';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.patch(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_reminder_setting
     * @param {}
     */
    view_reminder_setting(parameters: {
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/view_reminder_setting';
        let queryParameters = {};
        let url: string;
        let requestOptionArgs = {};
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }
        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };
        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#connect_with_facebook
     * @param {} body - user signin
     *
     */
    connect_with_facebook(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/connect_with_facebook';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if (parameters['data'] !== undefined) {
            body = JSON.stringify(parameters['data']);
        }

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#disconnect_with_facebook
     * @param {} body - user signin
     *
     */
    disconnect_with_facebook(parameters: {
        'password' ? : string,
        'password_confirmation' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/disconnect_with_facebook';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        queryParameters = this.setNonPatternTypeParameter('password', 'password', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('password_confirmation', 'password_confirmation', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#disconnect_with_facebook
     * @param {} body - user signin
     *
     */
    send_a_message(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/settings/send_a_message';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#load_community_condition
     * @param {} body - load_community_condition
     *
     */
    load_community_condition(parameters: {
        'search_word' ? : string,
        'sort_by' ? : string,
        'page' ? : number,
        'per_page' ? : number,
        'offset' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if(parameters["search_word"] != undefined && parameters["search_word"] != ""){
            queryParameters = this.setNonPatternTypeParameter('search_word', 'search_word', queryParameters, parameters);    
        }
        
        if(parameters["sort_by"] != undefined && parameters["sort_by"] != ""){
            queryParameters = this.setNonPatternTypeParameter('sort_by', 'sort_by', queryParameters, parameters);    
        }
        
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#list_conditions
     * @param {} body - list_conditions
     *
     */
    list_conditions(parameters: {
        'search_word' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/list_conditions/{search_word}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{search_word}/, parameters['search_word'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#get_condition_details_by_id
     * @param {} body - list_conditions
     *
     */
    get_condition_details_by_id(parameters: {
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#view_common_symptoms
     * @param {} body - view_common_symptoms
     *
     */
    view_common_symptoms(parameters: {
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/view_common_symptoms';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#treatments_taken
     * @param {} body - treatments_taken
     *
     */
    treatments_taken(parameters: {
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/treatments_taken';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_logs
     * @param {} body - patients_logs
     *
     */
    patients_logs(parameters: {
        'id' ? : number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/patients_logs';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_gender_wise
     * @param {} body - patients_gender_wise
     *
     */
    patients_gender_wise(parameters: {
        'id' ? : number,
        'gender' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/patients_gender_wise';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('gender', 'gender', queryParameters, parameters);

        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_diagnosed_non_diagnosed
     * @param {} body - patients_diagnosed_non_diagnosed
     *
     */
    patients_diagnosed_non_diagnosed(parameters: {
        'id' ? : number,
        'is_diagnosed' ? : boolean,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/patients_diagnosed_non_diagnosed';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('is_diagnosed', 'is_diagnosed', queryParameters, parameters);
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#patients_when_diagnosed_or_exp_diagnosed
     * @param {} body - patients_when_diagnosed_or_exp_diagnosed
     *
     */
    patients_when_diagnosed_or_exp_diagnosed(parameters: {
        'id' ? : number,
        'diagnosed' ? : string,
        'age_range' ? : string,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/conditions/{id}/patients_when_diagnosed_or_exp_diagnosed';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        path = path.replace(/{id}/, parameters['id'].toString());

        queryParameters = this.setNonPatternTypeParameter('diagnosed', 'diagnosed', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('age_range', 'age_range', queryParameters, parameters);
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
  
     /**
     * @method
     * @name SCApi#password_recovery
     * @param {} body - user signin
     *
     */
    password_recovery(parameters: {
        'data' ? : any,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/users/password_recovery';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};

        if(parameters["data"] != undefined){
            body = JSON.stringify(parameters["data"]);
        }
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
      
    /**
     * @method
     * @name SCApi#SaveSearches
     * @param {} body -
     *
     */
    getSavedSearches(parameters: {
        'page' ? : number,
        'per_page' ?: number,
        'offset' ? : number,
        'search_type'?:string
        $queryParameters ? : {}
    },headers: Headers): Observable < any > {
       
        let path = '/save_searches';
        let queryParameters = {};
        let body: string = "";
        let url: string;
      
        let requestOptionArgs = {};        

        queryParameters = this.setNonPatternTypeParameter('search_type', 'search_type', queryParameters, parameters);        
        queryParameters = this.setNonPatternTypeParameter('page', 'page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('per_page', 'per_page', queryParameters, parameters);
        queryParameters = this.setNonPatternTypeParameter('offset', 'offset', queryParameters, parameters);


        url = this.getUrl(path, queryParameters);
        requestOptionArgs = {
            headers: headers
        };

        return this.http.get(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#delete_Search
     * @param {} body -
     *
     */
    delete_Search(parameters: {
        'id' ?: number,
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/save_searches/{id}';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let paramsStr: string;

        path = path.replace(/{id}/, parameters['id'].toString());
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.delete(url, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };

    /**
     * @method
     * @name SCApi#SavePatientSearch
     * @param {} body - user signin
     *
     */
    SavePatientSearch(parameters: {
        "search_name":string,
        "search_type":string,
        "condition_id":any,                
        'name'?:string,
        'agerange'?:string,
        'gender'?:string,
        'gender_identity'?:string,
        'interests'?:any,
        'symptom_ids'?:any,
        'country_code'?:string,
        'city_states'?:any,
        'treatment_ids':any        
        $queryParameters ? : {}
    }, headers: Headers): Observable < any > {
        let domain = this.domain;
        let path = '/save_searches';
        let body: string = "";
        let queryParameters = {};
        let url: string;
        let form = new FormData();
        let requestOptionArgs = {};
        let temp ="";
        let temp1="";
        let temp2="";
        let city_statesPath="";
        let data = '{"name": "{search_name}","search_type": "{search_type}","parameters":{ "age":"{agerange}","gender":"{gender}","gender_identity":"{gender_identity}","name":"{name}","country_code":"{country_code}","city_states":[{city_states}],"interests":{interests},"treatment_ids":[{treatment_ids}],"symptom_ids":[{symptom_ids}],"condition_id":[{condition_id}]}}';


        if(parameters["search_name"] !== null){
            data = data.replace(/{search_name}/, parameters['search_name'])
        }else{
            data = data.replace(/{search_name}/, "")
        }
        if(parameters["search_type"] !== null){
            data = data.replace(/{search_type}/, parameters['search_type'])
        }else{
            data = data.replace(/{search_type}/, "")
        }
        if(parameters["treatment_ids"] !== null ){
            for(var i=0;i<parameters["treatment_ids"].length;i++){
                if((i+1) == parameters["treatment_ids"].length){
                    temp=temp+parameters["treatment_ids"][i].id;
                }
                else{
                    temp=temp+parameters["treatment_ids"][i].id+",";
                }
            }
            data = data.replace(/{treatment_ids}/, temp);
        }else{
            data = data.replace(/{treatment_ids}/, "")
        }
        if(parameters["symptom_ids"] !== null ){
            for(var i=0;i<parameters["symptom_ids"].length;i++){
                if((i+1) == parameters["symptom_ids"].length){
                    temp1=temp1+parameters["symptom_ids"][i].id;
                }
                else{
                    temp1=temp1+parameters["symptom_ids"][i].id+",";
                }
            }
            data = data.replace(/{symptom_ids}/, temp1);
        }else{
            data = data.replace(/{symptom_ids}/, "")
        }
        if(parameters["condition_id"] !== null ){
            for(var i=0;i<parameters["condition_id"].length;i++){
                if((i+1) == parameters["condition_id"].length){
                    temp2=temp2 + '{"id":' + parameters["condition_id"][i].id+"}";    
                }
                else{
                    temp2=temp2 + '{"id":' + parameters["condition_id"][i].id+"},";
                }                
            }
            data = data.replace(/{condition_id}/, temp2);
        }else{
            data = data.replace(/{condition_id}/, "")
        }
        if(parameters["country_code"] !== null && parameters["city_states"] !== null ){
            for(var i=0;i<parameters["city_states"].length;i++){
                if((i+1) == parameters["city_states"].length){
                    city_statesPath='"'+parameters["city_states"][i]+'"';
                }
                else{
                    city_statesPath='"'+parameters["city_states"][i]+'",';
                }
            }
            data = data.replace(/{city_states}/, city_statesPath);
            data = data.replace(/{country_code}/, parameters['country_code']);
        }else{
            data = data.replace(/{country_code}/, "");
            data = data.replace(/{city_states}/, "")
        }
        if(parameters["name"] !== null){
            data = data.replace(/{name}/, parameters['name'])
        }else{
            data = data.replace(/{name}/, "")
        }
        if(parameters["agerange"] !== null){
            data = data.replace(/{agerange}/, parameters['agerange'])
        }else{
            data = data.replace(/{agerange}/, "")
        }
        if(parameters["gender"] !== null){
            data = data.replace(/{gender}/, parameters['gender'])
        }else{
            data = data.replace(/{gender}/, "")
        }
        if(parameters["gender_identity"] !== null){
            data = data.replace(/{gender_identity}/, parameters['gender_identity'])
        }else{
            data = data.replace(/{gender_identity}/, "")
        }
        if(parameters["interests"] != null){
            data = data.replace(/{interests}/, parameters["interests"])                                              
        }else{
            data = data.replace(/{interests}/, "")
        }

        body = data;        
        
        if (parameters.$queryParameters) {
            queryParameters = this.setQueryParameters(parameters, queryParameters);
        }

        url = this.getUrl(path, queryParameters);

        requestOptionArgs = {
            headers: headers
        };

        return this.http.post(url, body, requestOptionArgs)
            .map(res => {
                return {
                    body: res.json(),
                    headers: res.headers,
                }
            })
            .catch(this.handleError);
    };
}

export const APP_SC_PROVIDERS = [SCApi];