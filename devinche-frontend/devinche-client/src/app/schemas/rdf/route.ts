// app/wam/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const turtle = `
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix schema: <https://schema.org/> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .
@prefix wam:   <https://devinche/schemas/rdf#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

# Define Node classes
wam:SecurityRealmNode rdf:type rdfs:Class ;
  rdfs:label "Security Realm Node" ;
  rdfs:subClassOf wam:Node ;
  rdfs:comment "Node representing security realm components" .

wam:ApplicationNode rdf:type rdfs:Class ;
  rdfs:label "Application Node" ;
  rdfs:subClassOf wam:Node .

wam:DataProviderNode rdf:type rdfs:Class ;
  rdfs:label "Data Provider Node" ;
  rdfs:subClassOf wam:Node .

wam:IdentityProviderNode rdf:type rdfs:Class ;
  rdfs:label "Identity Provider Node" ;
  rdfs:subClassOf wam:Node .

wam:ProcessUnitNode rdf:type rdfs:Class ;
  rdfs:label "Process Unit Node" ;
  rdfs:subClassOf wam:Node .

wam:ServiceNode rdf:type rdfs:Class ;
  rdfs:label "Service Node" ;
  rdfs:subClassOf wam:Node .

wam:DatasetNode rdf:type rdfs:Class ;
  rdfs:label "Dataset Node" ;
  rdfs:subClassOf wam:Node .

wam:AiProcessNode rdf:type rdfs:Class ;
  rdfs:label "AI Process Node" ;
  rdfs:subClassOf wam:Node .

wam:AiApplicationNode rdf:type rdfs:Class ;
  rdfs:label "AI Application Node" ;
  rdfs:subClassOf wam:Node .

wam:AiServiceNode rdf:type rdfs:Class ;
  rdfs:label "AI Service Node" ;
  rdfs:subClassOf wam:Node .

# Define Edge classes
wam:TrustEdge rdf:type rdfs:Class ;
  rdfs:label "Trust Edge" ;
  rdfs:subClassOf wam:Edge .

wam:InvocationEdge rdf:type rdfs:Class ;
  rdfs:label "Invocation Edge" ;
  rdfs:subClassOf wam:Edge .

wam:LegacyEdge rdf:type rdfs:Class ;
  rdfs:label "Legacy Edge" ;
  rdfs:subClassOf wam:Edge .

# Base Node class properties
wam:Node rdf:type rdfs:Class ;
  rdfs:label "Base Node Class" .

wam:x rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "X Position" .

wam:y rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "Y Position" .

wam:width rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "Width" .

wam:height rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "Height" .

wam:name rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "Node Name" .

wam:type rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "Node Type" .

wam:cost rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "Cost" .

# Common properties across node types
wam:location rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "Location" .

wam:certificateId rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "Certificate ID" .

# Node-specific properties
wam:allocateIP rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:SecurityRealmNode ;
  rdfs:range xsd:string .

wam:encryptionType rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:SecurityRealmNode ;
  rdfs:range xsd:string .

wam:signInSupport rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:ApplicationNode ;
  rdfs:range xsd:string .

wam:sessionTimeout rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:ApplicationNode ;
  rdfs:range xsd:string .

wam:protocols rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:ServiceNode ;
  rdfs:range xsd:string .

wam:authenticationType rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:ServiceNode ;
  rdfs:range xsd:string .

wam:format rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:DatasetNode ;
  rdfs:range xsd:string .

wam:size rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:DatasetNode ;
  rdfs:range xsd:string .

wam:source rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:DatasetNode ;
  rdfs:range xsd:string .

wam:algorithm rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiProcessNode ;
  rdfs:range xsd:string .

wam:accuracy rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiProcessNode ;
  rdfs:range xsd:string .

wam:modelFamily rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:modelVersion rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:systemPrompt rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:temperature rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:maxTokens rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:knowledgeBase rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiApplicationNode ;
  rdfs:range xsd:string .

wam:provider rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiServiceNode ;
  rdfs:range xsd:string .

wam:apiQuota rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiServiceNode ;
  rdfs:range xsd:string .

wam:latencyTarget rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:AiServiceNode ;
  rdfs:range xsd:string .

# Base Edge class properties
wam:Edge rdf:type rdfs:Class ;
  rdfs:label "Base Edge Class" .

wam:source rdf:type owl:ObjectProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range wam:Node ;
  rdfs:label "Source Node" .

wam:target rdf:type owl:ObjectProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range wam:Node ;
  rdfs:label "Target Node" .

wam:strokeColor rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

wam:strokeWidth rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:decimal .

wam:markerType rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

wam:markerColor rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

wam:sourceHandle rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

wam:targetHandle rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

wam:label rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string .

# Edge-specific properties
wam:authStrategy rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:TrustEdge ;
  rdfs:range xsd:string .

wam:issuer rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:TrustEdge ;
  rdfs:range xsd:string .

wam:scopes rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:TrustEdge ;
  rdfs:range xsd:string .

wam:verification rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:TrustEdge ;
  rdfs:range xsd:string .

wam:protocol rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:InvocationEdge ;
  rdfs:range xsd:string .

wam:path rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:InvocationEdge ;
  rdfs:range xsd:string .

wam:method rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:InvocationEdge ;
  rdfs:range xsd:string .

wam:timeout rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:InvocationEdge ;
  rdfs:range xsd:string .

wam:legacyProtocol rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:LegacyEdge ;
  rdfs:range xsd:string .

wam:certificateId rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:LegacyEdge ;
  rdfs:range xsd:string .

wam:connectionMethod rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:LegacyEdge ;
  rdfs:range xsd:string .

wam:maintenance rdf:type owl:DatatypeProperty ;
  rdfs:domain wam:LegacyEdge ;
  rdfs:range xsd:string .

# Relationship predicates
wam:trusts rdf:type owl:ObjectProperty ;
  rdfs:domain wam:Node ;
  rdfs:range wam:Node ;
  rdfs:label "Trusts relationship" .

wam:invokes rdf:type owl:ObjectProperty ;
  rdfs:domain wam:Node ;
  rdfs:range wam:Node ;
  rdfs:label "Invokes relationship" .

wam:legacyConnectsTo rdf:type owl:ObjectProperty ;
  rdfs:domain wam:Node ;
  rdfs:range wam:Node ;
  rdfs:label "Legacy connects to relationship" .

`;

  return new NextResponse(turtle.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/turtle; charset=utf-8',
      'Content-Disposition': 'inline; filename="wam.ttl"',
    },
  });
}
