import { AfterViewInit, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { GenerationConfig } from "../generation-config";
import { PersonService } from "../person.service";

@Component({
	selector: "app-person-generator",
	templateUrl: "./person-generator.component.html",
	styleUrls: ["./person-generator.component.scss"]
})
export class PersonGeneratorComponent implements OnInit, AfterViewInit {

	generator: FormGroup;

	@Output()
	generateRequest = new EventEmitter<GenerationConfig>();

	constructor(private formBuilder: FormBuilder, private personService: PersonService) {
	}

	ngAfterViewInit(): void {
		this.initConfig();
	}

	ngOnInit() {
		this.generator = this.formBuilder.group({
			count: [1000, Validators.compose([Validators.min(0), Validators.max(1000), Validators.required])],
			gender: this.formBuilder.group({
				male: [true],
				female: [true]
			}, {validator: this.genderValidator})
		});
	}

	generate() {
		const value: GenerationConfig = this.parseToGenerationConfig(this.generator);
		if (this.generator.valid)
			this.generateRequest.emit(value);
	}

	genderValidator(control: AbstractControl): ValidationErrors {
		const maleChecked = control.get('male').value;
		const femaleChecked = control.get('female').value;
	  
		if (!maleChecked && !femaleChecked) {
		  return { required: true };
		}
	  
		return null;
	}

	parseToGenerationConfig(formGroup: FormGroup): GenerationConfig {
		const count = formGroup.get('count').value;
		const male = formGroup.get('gender.male').value;
		const female = formGroup.get('gender.female').value;
		const value: GenerationConfig = {
			count: count,
			male: male,
			female: female
		};

		return value;
	}

	initConfig() {
		const config = this.personService.lastConfig;
		if(config) {
			this.generator.controls['count'].setValue(config.count);
			this.generator.get('gender.female').setValue(config.female);
			this.generator.get('gender.male').setValue(config.male);
		}
	}
}
