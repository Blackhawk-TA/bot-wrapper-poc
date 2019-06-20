import {IChannel} from "../interfaces/IChannel";
import {IServer} from "../interfaces/IServer";
import {DiscordServer} from "./DiscordServer";
import {IMessage} from "../interfaces/IMessage";
import {DiscordMessage} from "./DiscordMessage";

export class DiscordChannel implements IChannel {
	private _channel: any;

	constructor(channel: object) {
		this._channel = channel;
	}

	send(message?: string, options?: any): void {
		this._channel.send(message, options);
	}

	getId(): number {
		return this._channel.id;
	}

	getName(): string {
		return this._channel.name;
	}

	getServer(): IServer {
		return new DiscordServer(this._channel.guild);
	}

	getMessages(amount: number): Promise<IMessage[]> {
		return new Promise<IMessage[]>((resolve, reject) => {
			this._channel.fetchMessages({limit: amount}).then((messages) => {
				let Messages: IMessage[] = [];
				messages.forEach(message => {
					Messages.push(new DiscordMessage(message))
				});
				resolve(Messages);
			}).catch(error => {
				reject(error);
			});
		});
	}

	deleteMessages(messages: IMessage[]): Promise<IMessage[]> {
		return new Promise<IMessage[]>((resolve, reject) => {
			let Messages: IMessage[] = [];
			for (let i: number = 0; i < messages.length; i++) {
				let Message: IMessage = new DiscordMessage(messages[i]);
				Message.delete().then((result) => {
					if (result instanceof DiscordMessage) {
						Messages.push(result);
					}
					if (i === messages.length - 1) {
						resolve(Messages);
					}
				}).catch(error => {
					reject(error);
				});
			}
		});
	}

	awaitMessages(options?: object): Promise<IMessage[]> {
		return new Promise<IMessage[]>((resolve, reject) => {
			this._channel.awaitMessages(function() {return true}, options).then(messages => {
				let Messages: IMessage[] = [];
				messages.array().forEach(message => {
					Messages.push(new DiscordMessage(message));
				});
				resolve(Messages);
			}).catch(reason => {
				reject(reason);
			});
		});
	}
}