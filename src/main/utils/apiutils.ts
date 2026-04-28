import { APIRequestContext } from '@playwright/test';
import { request } from 'https';

export class APIUtils {


    private headers: Record<string, string> = {};
    constructor(private request: APIRequestContext) {

    }

    setHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    setHeaders(headers: Record<string, string>) {
        this.headers = { ...this.headers, ...headers };
    }

    removeHeader(key: string) {
        delete this.headers[key];
    }

    setBearerToken(token: string) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    private mergeHeaders(extra?: Record<string, string>) {
        return { ...this.headers, ...extra };
    }

    //API Methods 

    async getData(endpoint: string, extraHeaders?: Record<string, string>) {
        return await this.sendRequest('get', endpoint, undefined, extraHeaders);
    }

    async postData(endpoint: string, data: any, extraHeaders?: Record<string, string>) {

        return await this.sendRequest('post', endpoint, data, extraHeaders);
    }
    async putData(endpoint: string, data: any, extraHeaders?: Record<string, string>) {

        return await this.sendRequest('put', endpoint, data, extraHeaders);
    }

    async patchData(endpoint: string, data: any, extraHeaders?: Record<string, string>) {
        return await this.sendRequest('patch', endpoint, data, extraHeaders);
    }

    async deleteData(endpoint: string, extraHeaders?: Record<string, string>) {
        return await this.sendRequest('delete', endpoint, undefined, extraHeaders);
    }


    private async sendRequest(
        method: 'get' | 'post' | 'put' | 'patch' | 'delete',
        endpoint: string,
        data?: any,
        extraHeaders?: Record<string, string>
    ) {
        const options: any = {
            headers: this.mergeHeaders(extraHeaders),
        };

        if (data) {
            options.data = data;
        }

        return await this.request[method](endpoint, options);
    }

}