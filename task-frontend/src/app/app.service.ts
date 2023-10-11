import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class AppService{
    private apiUrl = 'http://localhost:5000/index';

    constructor(private http: HttpClient){}

    showData(): Observable<any>{
        return this.http.get(this.apiUrl);
    }
}