# Self-host app and tool registration vocabulary

- Status: accepted
- Deciders: [jg10](https://jg10.solidcommunity.net/profile/card#me), [Angelo Veltens](https://angelo.veltens.org/profile/card#me)

Technical Story: The UI should offer to open resources in apps and tools (also known as panes) based on the user's recorded preferences ([#47 Enable opening resource with other apps (open-with)](https://github.com/pod-os/PodOS/issues/47), [#14 Loading user-defined components? / Dynamic component registration](https://github.com/pod-os/PodOS/issues/14))

## Context and Problem Statement

The Solid ecosystem emphasises the ability to open data in multiple apps. If I navigate to a resource in PodOS I therefore want to be offered the opportunity to open the resource in another app, or display the resource with a custom view within the PodOS browser or a PodOS dashboard. Integration of custom dashboards, specialized views (PodOS Tools) and specialized apps is a core premise of PodOS ([SoSy 2026](https://angelo.veltens.org/slides/2026/from-apps-to-autonomy/2_pod-os/slides.html#/1)).

How might PodOS discover what apps and tools the user wishes to use?

## Decision Drivers

- Registrations should be visible by PodOS but by the principle of least privilege should not be known to others
  - [Registry is primarily for internal use by PodOS](https://github.com/pod-os/PodOS/issues/126#issuecomment-3012733978)
- Existing specifications should be adopted where possible to increase potential for interoperability
- Lightweight implementation should work from day 1
  - Support for specifying apps and tools by the class of the resource, as implemented by [Type Indexes](https://solid.github.io/type-indexes/)
  - Backward compatibility for apps that allow specifying the resource to open in their URL
- Forward compatibility to be able to specifying apps and tools based on their shape/shapetrees
- Forward compatibility with other types of tools beyond PodOS dashboards
- Pane registration should be declarative - code execution should be controlled by PodOS and not rely on arbitrary execution of external code

## Considered Options

- Implementation of current SAI specification
- Self-host app and tool registration vocabulary extending type indexes
- Self-host app and tool registration vocabulary based on Application Capability Descriptions

### Noticed, but not further considered

- SolidOS uses panes that [register and activate themselves via JS](https://github.com/pod-os/PodOS/issues/126#issuecomment-4052048286), which requires trusted code.
- urn:solid:view is a [stopgap used to link types to their renderers](https://github.com/pod-os/PodOS/issues/126#issuecomment-4045576864)
- [schema:EntryPoint can be tied to an Action](https://github.com/pod-os/PodOS/issues/14#issuecomment-3694628435) but there is no mechanism to tie to a class or shape
- Wait for publication of a specification meeting all requirements
- Combination of specifications that would meet all requirements (PodOS tools are not supported anywhere)
- Proposal of new specifications that fill gaps

## Decision Outcome

Chosen option: "Self-host app and tool registration vocabulary based on Application Capability Descriptions" because Application Capability Descriptions are possible now, designed to be extensible in the way that PodOS would extend them. However, maintaining a registry is [out of scope by design](https://github.com/pod-os/PodOS/issues/47#issuecomment-5003461929) and requires additional implementation decisions.

- Preferences document links to a type index-like registry of apps and tools using a custom predicate
- The registry consists of [application capability descriptions](https://dokieli.github.io/application-capability/), following an [emerging specification](https://github.com/solid/specification/issues/806)
- Apps use the standard application capability description. The means by which the description is added to the registry is out of scope of both this ADR and the upstream specification
- Tools/panes use a custom invocation subclass that PodOS (and other consumers) know how to invoke

An example registration for an app, using the Application Capability Description specification.

```turtle

<> a tools:ToolIndex;
tools:registration :app1_rego.

:app1_rego a tools:Registration ;
ac:capability :app1_rego_cap1;
schema:name "Umai viewer".

:app1_rego_cap1 a ac:Capability;
ac:action odrl:display;
ac:resourceType schema:Recipe;
ac:invocation :app1_rego_cap1_invocation1.

:app1_rego_cap1_invocation1 a ac:UriTemplateInvocation;
ac:mapping [
  ac:variable "url",
  ac:property ac:open,
];
ac:template "https://umai.noeldemartin.com/viewer?url={url}".
```

An example registration for a tool:

```turtle
<> a tools:ToolIndex;
tools:registration :tool1_rego.

:tool1  a tools:Registration ;
ac:capability :tool1_rego_cap1;
schema:name "Recipe pane".

:tool1_rego_cap1 a ac:Capability;
ac:action odrl:display;
ac:resourceType schema:Recipe;
ac:invocation :tool1_rego_cap1_invocation1.

:tool1_rego_cap1_invocation1 a tools:HtmlToolInvocation;
tools:htmlToolFragment  "<pos-label>".
```

### Positive Consequences

- Compatibility with an emerging specification
- Extensible but still relatively lightweight design

### Negative Consequences

- Custom solution that may require changes in future to align with future specs for both registry and tool/pane invocations
- Need to host vocabulary

## Pros and Cons of the Options

### Implementation of current SAI specification

https://github.com/solid/data-interoperability-panel

- Principle of least privilege built in, but [treatment of browser applications unresolved](https://github.com/solid/data-interoperability-panel/issues/237)
- Requires changes to servers to support
- Uses shapetrees, which are not yet widely adopted
- [App display endpoint predicate](https://github.com/pod-os/PodOS/issues/47#issuecomment-3907368818) not yet formally adopted
- No native support for panes

### Self-host app and tool registration vocabulary extending type indexes

https://jg10.solidcommunity.net/open-with/databrowser-open-with-v0.html#discovery-profile-type-indexes

- Lightweight extension of existing specification by adding predicates for panes and apps
- No clear mechanism to support shapes in future
- [Granularity of type indexes](https://github.com/pod-os/PodOS/issues/47#issuecomment-3925036441) is theoretically intended to be coarser
- Type registrations without instance or instanceContainer would be [non-conformant](https://github.com/pod-os/PodOS/issues/47#issuecomment-3925227256)

