# Function Size

Identify functions genuinely handling multiple responsibilities. Assess responsibility count, natural boundaries, and whether extraction improves readability and reasoning.

Do not impose a rule that everything longer than 20 lines must be split. Do not fragment small understandable functions for length alone. Cite the boundary and explain the smallest useful extraction. Check captures, side effects, ordering, and errors; mark uncertain behavior preservation questionable.
