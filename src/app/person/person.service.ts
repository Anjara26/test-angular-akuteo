import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { GenerationConfig } from "./generation-config";
import { Person } from "./person";

@Injectable({
	providedIn: "root"
})
export class PersonService {

	lastConfig: GenerationConfig;
	lastGeneratedPersons: Person[] = [];

	constructor(private http: HttpClient) {
	}

	getPersons(config: GenerationConfig): Observable<Person[]> {
		this.lastConfig = config;
		return this.http.get<Person[]>("/assets/data/persons.json").pipe(
			map((persons: Person[]) => {
			  if (config.female && !config.male) {
				return persons.filter((person) => person.gender === "Female");
			  } else if (!config.female && config.male) {
				return persons.filter((person) => person.gender === "Male");
			  }
			  return persons;
			}),
			map((persons: Person[]) => persons.slice(0, config.count).map((p, index) => {
				p.id = index + 1;
				return p;
			})),
			map((persons: Person[]) => this.lastGeneratedPersons = persons)
		);
	}
}
