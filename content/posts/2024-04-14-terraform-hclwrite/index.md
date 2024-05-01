---
title: "A comparative guide to generate Terraform / HCL"
description: |
  Programatically writing Terraform using Go, hclwrite, and cty. Composing HCL from code without losing typesafety.
tags:
  - golang
  - terraform
  - hcl
---

{{< callout class="info" >}}
The project which inspired this post is now live on GitHub! Check it out and let me know what you think: [firehydrant/signals-migrator](https://github.com/firehydrant/signals-migrator).
{{< /callout >}}

Terraform end-users are programmers who would write `.tf` files. As such, if you are one, you would be familiar with a line like so:

```hcl
resource "aws_vpc" "team_rocket" {
  cidr_block = "10.0.0.0/16"
}
```

Within the ecosystem, Terraform also has custom providers. Some programmers maintain and develop those for miscellaneous services. My employer is in this category, providing [terraform-provider-firehydrant](https://registry.terraform.io/providers/firehydrant/firehydrant/latest) for customers.

Then, there is the third side that we rarely talk about, the inverse of Terraform end-users: maintaining a program to generate Terraform configuration. One such project is [Terraformer](https://github.com/GoogleCloudPlatform/terraformer) from Waze, which scans existing infrastructure and outputs Terraform configuration that reflects it.

> Writing program, to generate configuration, so that infrastructure is reflected as configuration and convention.
> Very Computer Thing going on here.

If it sounds slightly off, it kind of is! There are valid use cases for this, but certainly quite rare compared to the other two categories. Typically in migration / bootstrap situation for adopting new platform.

## So you want to generate Terraform files

I won’t advise you on whether you should do it or not. However, if you have decided to do it, the rest of this post may be helpful. We will be using two libraries:

- [github.com/hashicorp/hcl/v2/hclwrite](https://pkg.go.dev/github.com/hashicorp/hcl/v2/hclwrite) the primary package to generate HCL (HashiCorp Configuration Language) files
- [github.com/zclconf/go-cty/cty](https://pkg.go.dev/github.com/zclconf/go-cty@v1.14.4/cty) the underlying type system used within HCL.

Start with the canvas. Think of it as a virtual file or buffer.

```go
f := hclwrite.NewEmptyFile()
rootBody := f.Body()
```

### Creating a resource block

```hcl
resource "some_resource" "for_some_team" {
  id   = 1
  name = "team rocket"
}
```

```go
// Declare a new "block" for the resource
r := rootBody.AppendNewBlock(
  "resource",
  []string{"some_resource", "for_some_team"},
)
// Now write the content of the block
r.SetAttributeValue("id", cty.NumberIntVal(1))
r.SetAttributeValue("name", cty.StringVal("team rocket"))
```

Conversely, for “data” block, replace `"resource"` with `"data"`.

You may also find blocks without extra attribute labels, like the `terraform` block.

```hcl
terraform {
  required_providers {
    # ...cut...
  }
}
```

```go
tf := rootBody.AppendNewBlock("terraform", nil)
p := p.AppendNewBlock("required_providers", nil)
```

### Creating anonymous block / map

```hcl
musicians = {
  mozart = true
}
```

```go
m := cty.ObjectVal(map[string]cty.Value{
  "mozart": cty.True,
})
rootBody.SetAttributeValue("musicians", m)
```

### Referencing another object

```hcl
resource "acme_team" "team_rocket" {
  admin_id = acme_user.alice.id
}
```

```go
r := rootBody.AppendNewBlock(
  "resource",
  []string{"acme_team", "team_rocket"},
}

r.SetAttributeTraversal(
  "member_ids",
  hcl.Traversal{
    hcl.TraverseRoot{Name: "acme_user"},
    hcl.TraverseAttr{Name: "alice"},
    hcl.TraverseAttr{Name: "id"},
  },
)
```

At the time of writing this post, writing a list of traversal involves `SetAttributeRaw` by providing `Tokens` value.

```hcl
resource "acme_team" "team_rocket" {
  members = [
    acme_user.bob.id,
    acme_user.charlie.id,
  ]
}
```

```go
bob := hcl.Traversal{ /* See previous example */ }
charlie := hcl.Traversal{ /* See previous example */ }

r.SetAttributeRaw(
  "members",
  hcl.TokensForTuple([]hcl.Tokens{
    hcl.TokensForTraversal(bob),
    hcl.TokensForTraversal(charlie),
  }),
)
```

### Adding comments

```hcl
# This is
# a comment
```

```go
rootBody.AppendUnstructuredTokens(
  hclwrite.Tokens{
    &hclwrite.Token{
      Type:  hclsyntax.TokenComment,
      Bytes: []byte("# This is\n# a comment"),

      SpacesBefore: 0,
    },
  },
)
```
