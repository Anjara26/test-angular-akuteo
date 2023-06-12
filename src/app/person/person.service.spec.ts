import { HttpClientTestingModule } from "@angular/common/http/testing";
import { fakeAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpMethod, SpectatorHttp } from "@ngneat/spectator";

import { createComponentFactory, createHttpFactory, Spectator } from '@ngneat/spectator/jest';
import { Person } from "./person";
import { PersonGeneratorComponent } from "./person-generator/person-generator.component";
import { PersonListComponent } from "./person-list/person-list.component";
import { PersonService } from "./person.service";
import { MatPaginatorModule } from "@angular/material/paginator";


const PERSONS: Person[] = [
	{
		id: 1,
		firstName: "John",
		lastName: "REESE",
		email: "john@reese.com",
		gender: "Male"
	},
	{
		id: 2,
		firstName: "Harold",
		lastName: "FINCH",
		email: "harold@finch.com",
		gender: "Male"
	},
	{
		id: 3,
		firstName: "Joss",
		lastName: "CARTER",
		email: "joss@carter.com",
		gender: "Female"
	}
];

const DEFAULT_CONFIG = {
	count: 3,
	male: true,
	female: true
};

const MALE_CONFIG = {
	count: 3,
	male: true,
	female: false
}

const FEMALE_CONFIG = {
	count: 3,
	male: false,
	female: true
}

describe("PersonListComponent", () => {

	let spectator: Spectator<PersonListComponent>;
	let spectatorHttp: SpectatorHttp<PersonService>;

	const createHttp = createHttpFactory(PersonService);
	const createComponent = createComponentFactory({
		component: PersonListComponent,
		declarations: [
			PersonListComponent,
			PersonGeneratorComponent,
		],
		imports: [
			MatTableModule,
			MatCheckboxModule,
			MatInputModule,
			MatButtonModule,
			MatPaginatorModule,
			ReactiveFormsModule,
			HttpClientTestingModule,
			NoopAnimationsModule,
			RouterTestingModule.withRoutes([])
		]
	});

	beforeEach(() => {
		spectator = createComponent();
		spectatorHttp = createHttp();
	});

	test('should create', () => {
		expect(spectator.component).toBeTruthy();
	});

	test("should provide a list of 3 persons", fakeAsync(() => {

		expect(spectatorHttp.service.getPersons).toBeTruthy();

		spectatorHttp.service.getPersons(DEFAULT_CONFIG).subscribe();
		spectatorHttp.expectOne("/assets/data/persons.json", HttpMethod.GET);

		spectatorHttp.service.getPersons(DEFAULT_CONFIG).subscribe(element => {
			expect(element.length).toBe(3);
			expect(element.map(p => p.id)).toEqual([1, 2, 3]);

		});

		const reqs = spectatorHttp.expectConcurrent([
			{ url: "/assets/data/persons.json", method: HttpMethod.GET },
		]);

		spectatorHttp.flushAll(reqs, [PERSONS]);

	}));

	test("should provide a list of Male only", fakeAsync(() => {
		spectatorHttp.service.getPersons(MALE_CONFIG).subscribe(element => {
			expect(element.length).toBe(2);
			expect(element.map(p => p.id)).toEqual([1, 2]);
			expect(element.map(p => p.gender)).toEqual(["Male", "Male"]);
		});

		const reqs = spectatorHttp.expectConcurrent([
			{ url: "/assets/data/persons.json", method: HttpMethod.GET },
		]);

		spectatorHttp.flushAll(reqs, [PERSONS]);
	}));

	test("should provide a list of Female only", fakeAsync(() => {
		spectatorHttp.service.getPersons(FEMALE_CONFIG).subscribe(element => {
			expect(element.length).toBe(1);
			expect(element.map(p => p.id)).toEqual([1]);
			expect(element.map(p => p.gender)).toEqual(["Female"]);
		});

		const reqs = spectatorHttp.expectConcurrent([
			{ url: "/assets/data/persons.json", method: HttpMethod.GET },
		]);

		spectatorHttp.flushAll(reqs, [PERSONS]);
	}));
	
});

