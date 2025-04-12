import { launch } from '@cloudflare/playwright';

export default {
	async fetch(request: Request, env: Env) {
		const { searchParams } = new URL(request.url);

		const todos = searchParams.getAll('todo');

		const browser = await launch(env.MYBROWSER);
		const page = await browser.newPage();

		await page.goto('https://demo.playwright.dev/todomvc');

		const TODO_ITEMS = todos.length > 0 ? todos : ['buy some cheese', 'feed the cat', 'book a doctors appointment'];

		const newTodo = page.getByPlaceholder('What needs to be done?');
		for (const item of TODO_ITEMS) {
			await newTodo.fill(item);
			await newTodo.press('Enter');
		}

		const img = await page.screenshot();
		await browser.close();

		return new Response(img, {
			headers: {
				'Content-Type': 'image/png',
			},
		});
	},
};
