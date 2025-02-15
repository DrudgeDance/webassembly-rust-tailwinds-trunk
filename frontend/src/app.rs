use leptos::*;
use leptos_meta::*;
use leptos::prelude::*;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>
        <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <header class="fixed top-0 w-full bg-white shadow-sm z-10">
                <nav class="container mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="text-xl font-semibold text-gray-800">"Leptos + Tailwind"</div>
                        <div class="flex space-x-4">
                            <a href="#" class="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors">"Home"</a>
                            <a href="#" class="px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors">"About"</a>
                        </div>
                    </div>
                </nav>
            </header>
            <main class="container mx-auto px-4 pt-20">
                <HomePage/>
            </main>
            <footer class="mt-auto py-6 bg-white shadow-inner">
                <div class="container mx-auto px-4 text-center text-gray-600">
                    "Built with Leptos and Tailwind CSS v4"
                </div>
            </footer>
        </div>
    }
}

/// Renders the home page
#[component]
fn HomePage() -> impl IntoView {
    view! {
        <div class="min-h-[calc(100vh-theme(spacing.40))] py-6 flex flex-col justify-center sm:py-12">
            <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div class="max-w-md mx-auto">
                        <div class="divide-y divide-gray-200">
                            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <h1 class="text-3xl font-bold text-gray-900 mb-4">"Welcome to Leptos!"</h1>
                                <p class="text-gray-600">"This is a basic Leptos app with Tailwind CSS v4."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

/// 404 - Not Found
#[component]
fn NotFound() -> impl IntoView {
    view! {
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">"404 - Not Found"</h1>
                <p class="text-lg text-gray-600">"The page you're looking for does not exist."</p>
            </div>
        </div>
    }
}
