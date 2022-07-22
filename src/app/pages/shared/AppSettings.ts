import {environment} from '../../../environments/environment';

export class AppSettings {
    public static UPLOAD_API_ENDPOINT = environment.uploadServiceURI;
    public static CURRENTADDRESS = environment.currentAddress;
    public static CORE_API_ENDPOINT = environment.coreServiceUrl;
    public static TASK_API_ENDPOINT = environment.taskManagerServiceUrl;
    public static USER_MANAGEMENT_API_ENDPOINT = environment.userManagementServiceUrl;
    public static FIELD_API_ENDPOINT = environment.fieldServiceUrl;
    public static SOURCES_API_ENDPOINT = environment.sourcesServiceUrl;
    public static COMMENT_API_ENDPOINT = environment.commentServiceUrl;
}
