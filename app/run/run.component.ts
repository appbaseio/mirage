import {Component} from "angular2/core";
import {prettyJson} from "../shared/pipes/prettyJson";


@Component({
	selector: 'query-run',
	templateUrl: './app/run/run.component.html',
	styleUrls: ['./app/run/run.component.css'],
	inputs: ['mapping', 'config'],
	pipes: [prettyJson]
})

export class RunComponent {
	public mapping;
	public config;
}