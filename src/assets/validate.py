import pyshacl
from rdflib import Graph


def validate(shapes: str, data: str) -> tuple[bool, str]:
    conforms, results_graph, results_text = pyshacl.validate(
        data_graph=Graph().parse(data=data, format="turtle"),
        shacl_graph=Graph().parse(data=shapes, format="turtle"),
    )

    return conforms, results_text
