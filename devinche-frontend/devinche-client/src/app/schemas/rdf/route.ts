// app/wam/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const turtle = `
@prefix wam:   <https://example.org/wam#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix schema: <https://schema.org/> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .

###########
# Classes #
###########

wam:Diagram a rdfs:Class ;
  rdfs:label "Diagram" .

wam:Node a rdfs:Class ;
  rdfs:label "Node" .

wam:Edge a rdfs:Class ;
  rdfs:label "Edge" .

wam:ProcessUnitNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Process Unit Node" .

wam:DataProviderNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Data Provider Node" .

wam:ApplicationNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Application Node" .

wam:ServiceNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Service Node" .

wam:SecurityRealmNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Security Realm Node" .

wam:IdentityProviderNode a rdfs:Class ;
  rdfs:subClassOf wam:Node ;
  rdfs:label "Identity Provider Node" .

wam:InvocationEdge a rdfs:Class ;
  rdfs:subClassOf wam:Edge ;
  rdfs:label "Invocation Edge" .

wam:TrustEdge a rdfs:Class ;
  rdfs:subClassOf wam:Edge ;
  rdfs:label "Trust Edge" .

wam:LegacyEdge a rdfs:Class ;
  rdfs:subClassOf wam:Edge ;
  rdfs:label "Legacy Edge" .

##############
# Properties #
##############

wam:hasNode a rdf:Property ;
  rdfs:domain wam:Diagram ;
  rdfs:range wam:Node ;
  rdfs:label "has node" .

wam:hasEdge a rdf:Property ;
  rdfs:domain wam:Diagram ;
  rdfs:range wam:Edge ;
  rdfs:label "has edge" .

wam:label a rdf:Property ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:string ;
  rdfs:label "label" .

wam:xPos a rdf:Property ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "x position" .

wam:yPos a rdf:Property ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "y position" .

wam:width a rdf:Property ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "width" .

wam:height a rdf:Property ;
  rdfs:domain wam:Node ;
  rdfs:range xsd:decimal ;
  rdfs:label "height" .

wam:source a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range wam:Node ;
  rdfs:label "source node" .

wam:target a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range wam:Node ;
  rdfs:label "target node" .

wam:sourceHandle a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string ;
  rdfs:label "source handle" .

wam:targetHandle a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string ;
  rdfs:label "target handle" .

wam:strokeColor a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string ;
  rdfs:label "stroke color" .

wam:strokeWidth a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:decimal ;
  rdfs:label "stroke width" .

wam:markerType a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string ;
  rdfs:label "marker type" .

wam:markerColor a rdf:Property ;
  rdfs:domain wam:Edge ;
  rdfs:range xsd:string ;
  rdfs:label "marker color" .

wam:zoom a rdf:Property ;
  rdfs:domain wam:Diagram ;
  rdfs:range xsd:decimal ;
  rdfs:label "zoom level" .

wam:viewX a rdf:Property ;
  rdfs:domain wam:Diagram ;
  rdfs:range xsd:decimal ;
  rdfs:label "viewport X" .

wam:viewY a rdf:Property ;
  rdfs:domain wam:Diagram ;
  rdfs:range xsd:decimal ;
  rdfs:label "viewport Y" .
`;

  return new NextResponse(turtle.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'text/turtle; charset=utf-8',
      'Content-Disposition': 'inline; filename="wam.ttl"',
    },
  });
}
