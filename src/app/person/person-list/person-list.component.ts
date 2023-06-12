import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { GenerationConfig } from "../generation-config";
import { Person } from "../person";
import { PersonService } from "../person.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
	selector: "app-person-list",
	templateUrl: "./person-list.component.html",
	styleUrls: ["./person-list.component.scss"]
})
export class PersonListComponent implements AfterViewInit{

	displayedColumns: string[] = ["id", "firstName", "lastName", "gender", "email"];
	dataSource: MatTableDataSource<Person>;
	@ViewChild('paginator') paginator: MatPaginator;

	constructor(private personService: PersonService) {
	}

	ngAfterViewInit(): void {
		this.initDataSource();
	}

	generate(config: GenerationConfig) {
		this.personService.getPersons(config).subscribe(persons => {
			this.dataSource = new MatTableDataSource(persons);
			this.dataSource.paginator = this.paginator;
		})
	}

	initDataSource() {
		if(this.personService.lastGeneratedPersons.length > 0) {
			this.dataSource = new MatTableDataSource(this.personService.lastGeneratedPersons);
			this.dataSource.paginator = this.paginator;
		}
	}
}
