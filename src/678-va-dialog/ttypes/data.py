from copy import deepcopy
from typing import List, Optional, TypedDict, Union, Literal


class InodeData(TypedDict):
    name: str


class LeafData(TypedDict):
    name: str
    kcal: float
    price: float
    vegetarian: Optional[bool]
    alcoholic: Optional[bool]
    whereToTaste: str
    category: Union[
        Literal['Салат'], Literal['Закуски'], Literal['Выпечка'], Literal['Супы'], Literal['Основное'],
        Literal['Напитки'], Literal['Слабый алкоголь'], Literal['Крепкий алкоголь'],
    ]


LEAF_DATA_NUMERIC_FIELDS = ('kcal', 'price')
LEAF_DATA_BOOLEAN_FIELDS = ('vegetarian', 'alcoholic')
LEAF_DATA_CATEGORICAL_FIELDS = (
    {
        'name': 'category',
        'values': ('Салат', 'Закуска', 'Выпечка', 'Суп', 'Основное', 'Напиток', 'Слабый алкоголь', 'Крепкий алкоголь'),
    },
)


class NormalizedLeafData(TypedDict):
    kcal: float
    price: float
    vegetarian: float
    alcoholic: float
    category: float


class Score(TypedDict):
    like: float
    dislike: float
    total: float


class ExtendedLeafData:
    source: LeafData
    path: List[str]
    normalized: NormalizedLeafData
    score: Score

    def __init__(self, leaf_data: Optional[LeafData] = None):
        self.source = {
            'name': '__noname__',
            'kcal': 0,
            'price': 0,
            'vegetarian': False,
            'alcoholic': False,
            'whereToTaste': '__no_place__',
            'category': 'Салат'
        }
        self.path = []
        self.normalized = {
            'kcal': 0.5,
            'price': 0.5,
            'vegetarian': 0.5,
            'alcoholic': 0.5,
            'category': 0.5,
        }
        self.score = {
            'like': 0,
            'dislike': 0,
            'total': 0,
        }

        if leaf_data is None:
            return

        self.source = deepcopy(leaf_data)
        self.normalized['vegetarian'] = 1.0
        self.normalized['alcoholic'] = 0.0

        for field in LEAF_DATA_NUMERIC_FIELDS:
            self.normalized[field] = leaf_data[field]

        for field in LEAF_DATA_BOOLEAN_FIELDS:
            if field in leaf_data:
                self.normalized[field] = float(leaf_data[field])

        for field in LEAF_DATA_CATEGORICAL_FIELDS:
            self.normalized[field['name']] = \
                field['values'].index(leaf_data[field['name']]) / (len(field['values']) - 1)

    def __repr__(self):
        return f'ELD{{source={self.source}, path={self.path}, normalized={self.normalized}, score={self.score}}}\n'


EXTENDED_LEAF_DATA_NORMALIZED_FIELDS = \
    LEAF_DATA_NUMERIC_FIELDS + \
    LEAF_DATA_BOOLEAN_FIELDS + \
    tuple(field['name'] for field in LEAF_DATA_CATEGORICAL_FIELDS)

EXTENDED_LEAF_DATA_NORMALIZED_FIELDS_WEIGHTS = {
    'kcal': 1.0,
    'price': 1.1,
    'vegetarian': 0.8,
    'alcoholic': 0.9,
    'category': 1.2,
}
