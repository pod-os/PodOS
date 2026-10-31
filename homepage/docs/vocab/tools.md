---
title: PodOS tools vocabulary
---

# PodOS tools vocabulary

`https://pod-os.org/vocab/tools.ttl#`

A vocabulary for registering apps and HTML tools for use by PodOS. It extends
[Application Capability](https://dokieli.github.io/application-capability/)
with a private tool index and an HTML fragment invocation. The Turtle
definition is at [`tools.ttl`](/vocab/tools.ttl).

## Classes

- [ToolIndex](#ToolIndex)
- [Registration](#Registration)
- [AppRegistration](#AppRegistration)
- [ToolRegistration](#ToolRegistration)
- [HtmlFragmentInvocation](#HtmlFragmentInvocation)

## ToolIndex {#ToolIndex}

`https://pod-os.org/vocab/tools.ttl#ToolIndex`

A registry of app and tool registrations. The user's WebID points to it from
their preferences document with `tools:toolIndex`.

| Property | Expected type | Description |
|---|---|---|
| `tools:registration` | `tools:Registration` | An app or tool registration. |

## Registration {#Registration}

`https://pod-os.org/vocab/tools.ttl#Registration`

An entry in a tool index. Use `AppRegistration` for apps and `ToolRegistration`
for tools.

| Property | Expected type | Description |
|---|---|---|
| `ac:capability` | `ac:Capability` | A capability of the app or tool. |
| `schema:name` | Literal | A human-readable name. |

## AppRegistration {#AppRegistration}

`https://pod-os.org/vocab/tools.ttl#AppRegistration`

A registration for an external app. Each capability uses an
`ac:UriTemplateInvocation`.

| Property | Expected type | Description |
|---|---|---|
| `ac:capability` | `ac:Capability` | Uses an `ac:UriTemplateInvocation`. |
| `schema:name` | Literal | A human-readable name. |

## ToolRegistration {#ToolRegistration}

`https://pod-os.org/vocab/tools.ttl#ToolRegistration`

A registration for a PodOS tool. Each capability uses a
`tools:HtmlFragmentInvocation`.

| Property | Expected type | Description |
|---|---|---|
| `ac:capability` | `ac:Capability` | Uses a `tools:HtmlFragmentInvocation`. |
| `schema:name` | Literal | A human-readable name. |

## HtmlFragmentInvocation {#HtmlFragmentInvocation}

`https://pod-os.org/vocab/tools.ttl#HtmlFragmentInvocation`

An `ac:Invocation` that renders an HTML fragment inside PodOS.

| Property | Expected type | Description |
|---|---|---|
| `schema:url` | IRI | The HTML fragment to render. |

## Examples

The examples below show a private tool index and one registration of each
kind.

### Preferences document

The user's WebID points to a private tool index from their preferences
document.

```turtle
@base <https://alice.pod.example/settings/prefs.ttl> .
@prefix tools: <https://pod-os.org/vocab/tools.ttl#> .

<https://alice.pod.example/profile/card#me> tools:toolIndex <tool-index.ttl> .
```

### Tool index

The tool index lists the app and tool registrations. They can live in the
index document or in other documents. The examples below show them in the
index document.

```turtle
@base <https://alice.pod.example/settings/tool-index.ttl> .
@prefix tools: <https://pod-os.org/vocab/tools.ttl#> .

<tool-index.ttl> a tools:ToolIndex ;
    tools:registration <#umai>, <#recipe-pane> .
```

### App registration

This app registration offers the "Umai viewer" app to open `schema:Recipe`
resources. PodOS knows to expand the template with the resource IRI injected as
the `url` query parameter.

```turtle
@base <https://alice.pod.example/settings/tool-index.ttl> .
@prefix tools: <https://pod-os.org/vocab/tools.ttl#> .
@prefix ac: <https://www.w3.org/ns/ac#> .
@prefix hydra: <http://www.w3.org/ns/hydra/core#> .
@prefix schema: <https://schema.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#umai> a tools:AppRegistration ;
    schema:name "Umai viewer" ;
    ac:capability <#umai-cap> .

<#umai-cap> a ac:Capability ;
    ac:action odrl:display ;
    ac:resourceType schema:Recipe ;
    ac:invocation <#umai-inv> .

<#umai-inv> a ac:UriTemplateInvocation ;
    hydra:template "https://umai.noeldemartin.com/viewer?url={url}" ;
    hydra:mapping [
        hydra:variable "url" ;
        hydra:property ac:open
    ] .
```

### Tool registration

This tool registration offers a "Recipe pane" to render `schema:Recipe`
resources. PodOS knows to fetch `recipe.html`, sanitise it, and render it in the
current page.

```turtle
@base <https://alice.pod.example/settings/tool-index.ttl> .
@prefix tools: <https://pod-os.org/vocab/tools.ttl#> .
@prefix ac: <https://www.w3.org/ns/ac#> .
@prefix schema: <https://schema.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#recipe-pane> a tools:ToolRegistration ;
    schema:name "Recipe pane" ;
    ac:capability <#recipe-pane-cap> .

<#recipe-pane-cap> a ac:Capability ;
    ac:action odrl:display ;
    ac:resourceType schema:Recipe ;
    ac:invocation <#recipe-pane-inv> .

<#recipe-pane-inv> a tools:HtmlFragmentInvocation ;
    schema:url <https://alice.pod.example/tools/recipe.html> .
```

## Validation

The Turtle file includes SHACL shapes that check:

- each registration is an `AppRegistration` or `ToolRegistration`;
- every registration has at least one `ac:capability` and one `schema:name`;
- every capability declares exactly one `ac:action`;
- app capabilities use `ac:UriTemplateInvocation` with a `hydra:template`;
- tool capabilities use `tools:HtmlFragmentInvocation`;
- HTML fragment invocations have exactly one `schema:url`.

## See also

- [Turtle definition](/vocab/tools.ttl)
- [ADR-0018](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0018-self-host-app-registration-vocab.md)
- [Application Capability](https://dokieli.github.io/application-capability/)
