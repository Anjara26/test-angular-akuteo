import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutModule } from "./about/about.module";

export const routes: Routes = [
	{
		path: "personnes",
		loadChildren: () => import("./person/person.module").then(m => m.PersonModule)
	},
	{
		path: "about",
		loadChildren: () => import("./about/about.module").then(m => AboutModule)
	},
	{
		path: "",
		pathMatch: "full",
		redirectTo: "personnes"
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}

