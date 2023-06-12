import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Spectator } from "@ngneat/spectator";
import { createComponentFactory } from "@ngneat/spectator/jest";
import { PersonGeneratorComponent } from "./person-generator.component";
import { HttpClientModule } from "@angular/common/http";
import { GenerationConfig } from "../generation-config";

const DEFAULT_CONFIG: GenerationConfig = {
	count: 1000,
	male: true,
	female: true
};

describe("PersonGeneratorComponent", () => {

	let spectator: Spectator<PersonGeneratorComponent>;
	const createComponent = createComponentFactory({
		component: PersonGeneratorComponent,
		declarations: [
			PersonGeneratorComponent,
		],
		imports: [
			MatCheckboxModule,
			MatFormFieldModule,
			MatInputModule,
			MatButtonModule,
			HttpClientModule,
			ReactiveFormsModule,
			NoopAnimationsModule
		],
	});

	beforeEach(() => {
		spectator = createComponent();
	});


	test('should create', () => {
		expect(spectator.component).toBeTruthy();
	});

	test('should valid by default value', () => {
		expect(spectator.component.generator.valid).toBeTruthy();
	});

	test('should invalid if count < 0 or count > 1000', () => {
		const count = spectator.component.generator.controls['count'];

		count.setValue(-3);
		expect(spectator.component.generator.invalid).toBeTruthy();

		count.setValue(1003);
		expect(spectator.component.generator.invalid).toBeTruthy();
	});

	test('should invalid if no gender is selected', () => {
		spectator.component.generator.get('gender.male').setValue(false);
		spectator.component.generator.get('gender.female').setValue(false);

		expect(spectator.component.generator.invalid).toBeTruthy();
	});

	test('should return the default config', () => {
		expect(spectator.component.parseToGenerationConfig(spectator.component.generator)).toStrictEqual(DEFAULT_CONFIG);
	});

	test('should emit config when generator is valid', () => {
		jest.spyOn(spectator.component.generateRequest, 'emit');

		spectator.component.generator.get('count').setValue(DEFAULT_CONFIG.count);
		spectator.component.generator.get('gender.male').setValue(DEFAULT_CONFIG.male);
		spectator.component.generator.get('gender.female').setValue(DEFAULT_CONFIG.female);

		spectator.component.generate();

		expect(spectator.component.generateRequest.emit).toBeCalledWith(DEFAULT_CONFIG);
	});

	test('should not emit config when generator is invalid', () => {
		jest.spyOn(spectator.component.generateRequest, 'emit');
		
		spectator.component.generator.get('count').setValue(-20);
		spectator.component.generator.get('gender.male').setValue(DEFAULT_CONFIG.male);
		spectator.component.generator.get('gender.female').setValue(DEFAULT_CONFIG.female);

		spectator.component.generate();

		expect(spectator.component.generateRequest.emit).not.toBeCalled();
	});
});

