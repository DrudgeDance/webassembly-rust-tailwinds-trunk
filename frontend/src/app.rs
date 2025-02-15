use leptos::*;
use leptos_meta::*;
use leptos::prelude::*;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/frontend.css"/>
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>
        <main>
            <HomePage/>
        </main>
    }
}

/// Renders the home page
#[component]
fn HomePage() -> impl IntoView {
    view! {
        <div class="container">
            <h1>"Welcome to Leptos!"</h1>
            <p>"This is a basic Leptos app with server-side rendering."</p>
        </div>
    }
}

/// 404 - Not Found
#[component]
fn NotFound() -> impl IntoView {
    view! {
        <div class="container">
            <h1>"404 - Not Found"</h1>
            <p>"The page you're looking for does not exist."</p>
        </div>
    }
}
