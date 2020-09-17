var documenterSearchIndex = {"docs":
[{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"EditURL = \"https://github.com/AlgebraicJulia/AlgebraicPetri.jl/blob/master/examples/predation/lotka-volterra.jl\"","category":"page"},{"location":"examples/predation/lotka-volterra/#predation_example","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"","category":"section"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"(Image: )","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"using AlgebraicPetri\n\nusing Petri: Model, Graph\nusing OrdinaryDiffEq\nusing Plots\n\nusing Catlab\nusing Catlab.Theories\nusing Catlab.Programs\nusing Catlab.CategoricalAlgebra.FreeDiagrams\nusing Catlab.WiringDiagrams\nusing Catlab.Graphics\n\ndisplay_wd(ex) = to_graphviz(ex, orientation=LeftToRight, labels=true);\nnothing #hide","category":"page"},{"location":"examples/predation/lotka-volterra/#Step-1:-Define-the-building-block-Petri-nets-needed-to-construct-the-model","page":"Lotka-Volterra Model","title":"Step 1: Define the building block Petri nets needed to construct the model","text":"","category":"section"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"birth_petri = PetriCospan([1], PetriNet(1, (1, (1,1))), [1]);\nGraph(Model(decoration(birth_petri)))","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"predation_petri = PetriCospan([1,2], PetriNet(2, ((1,2), (2,2))), [2]);\nGraph(Model(decoration(predation_petri)))","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"death_petri = PetriCospan([1], PetriNet(1, (1, ())), [1]);\nGraph(Model(decoration(death_petri)))","category":"page"},{"location":"examples/predation/lotka-volterra/#Step-2:-Define-a-presentation-of-the-free-biproduct-category","page":"Lotka-Volterra Model","title":"Step 2: Define a presentation of the free biproduct category","text":"","category":"section"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"that encodes the domain specific information","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"@present Predation(FreeBiproductCategory) begin\n    prey::Ob\n    predator::Ob\n    birth::Hom(prey,prey)\n    predation::Hom(prey⊗predator,predator)\n    death::Hom(predator,predator)\nend;\n\nrabbits,wolves,birth,predation,death = generators(Predation);\n\nF(ex) = functor((PetriCospanOb, PetriCospan), ex, generators=Dict(\n                 rabbits=>PetriCospanOb(1),wolves=>PetriCospanOb(1),\n                 birth=>birth_petri, predation=>predation_petri, death=>death_petri));\nnothing #hide","category":"page"},{"location":"examples/predation/lotka-volterra/#Step-3:-Generate-models-using-the-hom-expression-or-program-notations","page":"Lotka-Volterra Model","title":"Step 3: Generate models using the hom expression or program notations","text":"","category":"section"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"lotka_volterra = (birth ⊗ id(wolves)) ⋅ predation ⋅ death\nlotka_petri = decoration(F(lotka_volterra))\ndisplay_wd(lotka_volterra)","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"Graph(Model(lotka_petri))","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"Generate appropriate vector fields, define parameters, and visualize solution","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"u0 = [100, 10];\np = [.3, .015, .7];\nprob = ODEProblem(vectorfield(lotka_petri),u0,(0.0,100.0),p);\nsol = solve(prob,Tsit5(),abstol=1e-8);\nplot(sol)","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"There is also a second syntax that is easier to write for programmers than the hom expression syntax. Here is an example of the same model as before along with a test of equivalency","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"lotka_volterra2 = @program Predation (r::prey, w::predator) begin\n  r_2 = birth(r)\n  w_2 = predation(r_2, w)\n  return death(w_2)\nend\nlotka_petri2 = decoration(F(to_hom_expr(FreeBiproductCategory, lotka_volterra2)))\nlotka_petri == lotka_petri2","category":"page"},{"location":"examples/predation/lotka-volterra/#Step-4:-Extend-your-presentation-to-handle-more-complex-phenomena","page":"Lotka-Volterra Model","title":"Step 4: Extend your presentation to handle more complex phenomena","text":"","category":"section"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"such as a small food chain","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"@present DualPredation <: Predation begin\n    Predator::Ob\n    Predation::Hom(predator⊗Predator,Predator)\n    Death::Hom(Predator,Predator)\nend;\n\nfish,Fish,Shark,birth,predation,death,Predation,Death = generators(DualPredation);\n\nF(ex) = functor((PetriCospanOb, PetriCospan), ex, generators=Dict(\n                 fish=>PetriCospanOb(1),Fish=>PetriCospanOb(1),\n                 birth=>birth_petri, predation=>predation_petri, death=>death_petri,\n                 Shark=>PetriCospanOb(1),Predation=>predation_petri, Death=>death_petri));\nnothing #hide","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"Define a new model where fish are eaten by Fish which are then eaten by Sharks","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"dual_lv = @program DualPredation (fish::prey, Fish::predator, Shark::Predator) begin\n  f_2 = birth(fish)\n  F_2 = predation(f_2, Fish)\n  F_3 = death(F_2)\n  S_2 = Predation(F_3, Shark)\n  S_3 = Death(S_2)\nend\ndisplay_wd(dual_lv)","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"dual_lv_petri = decoration(F(to_hom_expr(FreeBiproductCategory, dual_lv)))\nGraph(Model(dual_lv_petri))","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"Generate a new solver, provide parameters, and analyze results","category":"page"},{"location":"examples/predation/lotka-volterra/","page":"Lotka-Volterra Model","title":"Lotka-Volterra Model","text":"u0 = [100, 10, 2];\np = [.3, .015, .7, .017, .35];\nprob = ODEProblem(vectorfield(dual_lv_petri),u0,(0.0,100.0),p);\nsol = solve(prob,Tsit5(),abstol=1e-6);\nplot(sol)","category":"page"},{"location":"api/#Library-Reference","page":"Library Reference","title":"Library Reference","text":"","category":"section"},{"location":"api/","page":"Library Reference","title":"Library Reference","text":"Modules = [AlgebraicPetri]","category":"page"},{"location":"api/#AlgebraicPetri.AlgebraicPetri","page":"Library Reference","title":"AlgebraicPetri.AlgebraicPetri","text":"Computing in the category of finite sets and Petri cospans\n\n\n\n\n\n","category":"module"},{"location":"api/#AlgebraicPetri.PetriCospan","page":"Library Reference","title":"AlgebraicPetri.PetriCospan","text":"Petri Cospan\n\nA morphism in the category of Open Petri Nets defined as a decorated cospan with a PetriFunctor as the decorator which maps the category of finite ordinals to the category Petri and an AbstractPetriNet as the decoration\n\n\n\n\n\n","category":"type"},{"location":"api/#AlgebraicPetri.PetriCospanOb","page":"Library Reference","title":"AlgebraicPetri.PetriCospanOb","text":"Finite ordinal (natural number)\n\nAn object in the category of Open Petri Nets.\n\n\n\n\n\n","category":"type"},{"location":"api/#AlgebraicPetri.PetriDecorator-Tuple{Catlab.CategoricalAlgebra.FinSets.FinFunction}","page":"Library Reference","title":"AlgebraicPetri.PetriDecorator","text":"AlgebraicPetri.PetriDecorator(f::FinFunction)\n\nA functor from FinSet to Set has a hom part, which given a hom f in FinSet (a function n::Int->m::Int) should return a representation of F(f)::F(n)->F(m), here we implement this as a function that takes a Petri net of size n to a Petri net of size m, such that the transitions are mapped appropriately.\n\n\n\n\n\n","category":"method"},{"location":"api/#AlgebraicPetri.PetriDecorator-Tuple{Catlab.CategoricalAlgebra.FinSets.FinSet}","page":"Library Reference","title":"AlgebraicPetri.PetriDecorator","text":"AlgebraicPetri.PetriDecorator(n::FinSet)\n\nA functor from FinSet to Set has an objects part, which given an object n in FinSet (a natural number) should return a representation of F(n)::Set, sets can be represented as a predicate that takes an element and returns true if the element is in the set. Here we take any julia value and test whether it is a Petri net on n states.\n\n\n\n\n\n","category":"method"},{"location":"api/#AlgebraicPetri.PetriFunctor","page":"Library Reference","title":"AlgebraicPetri.PetriFunctor","text":"Petri Functor\n\nA functor from FinSet to Petri defined as a PetriDecorator and a PetriLaxator\n\n\n\n\n\n","category":"type"},{"location":"api/#AlgebraicPetri.PetriLaxator-Tuple{Catlab.CategoricalAlgebra.CSets.AttributedCSet{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},Catlab.Theories.AttrDesc{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},(),(),(),()},Tuple{},(:is, :it, :os, :ot),(),Tables,Indices} where Indices<:NamedTuple where Tables<:NamedTuple,Catlab.CategoricalAlgebra.CSets.AttributedCSet{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},Catlab.Theories.AttrDesc{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},(),(),(),()},Tuple{},(:is, :it, :os, :ot),(),Tables,Indices} where Indices<:NamedTuple where Tables<:NamedTuple}","page":"Library Reference","title":"AlgebraicPetri.PetriLaxator","text":"AlgebraicPetri.PetriLaxator(p::Petri.Model, q::Petri.Model)\n\nThe laxitor takes a pair of decorations and returns the coproduct decoration For Petri nets, this encodes the idea that you shift the states of q up by the number of states in p.\n\n\n\n\n\n","category":"method"},{"location":"api/#Core.Type-Tuple{AbstractArray{T,1} where T,Catlab.CategoricalAlgebra.CSets.AbstractAttributedCSet{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},AD,Ts} where Ts<:Tuple where AD<:(Catlab.Theories.AttrDesc{Catlab.Theories.CatDesc{(:T, :S, :I, :O),(:it, :is, :ot, :os),(3, 3, 4, 4),(1, 2, 1, 2)},Data,Attr,ADom,ACodom} where ACodom where ADom where Attr where Data),AbstractArray{T,1} where T}","page":"Library Reference","title":"Core.Type","text":"AlgebraicPetri.PetriCospan(l::Vector{Int}, m::AbstractPetriNet, r::Vector{Int})\n\nA constructor for Petri Cospans where l is a vector of the input states from AbstractPetriNet m, and r is a vector of the output states from AbstractPetriNet m\n\nConstructs the cospan: l → m ← r\n\n\n\n\n\n","category":"method"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"EditURL = \"https://github.com/AlgebraicJulia/AlgebraicPetri.jl/blob/master/examples/covid/epidemiology.jl\"","category":"page"},{"location":"examples/covid/epidemiology/#epidemiology_example","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"","category":"section"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"(Image: )","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"using AlgebraicPetri\nusing AlgebraicPetri.Epidemiology\n\nusing Petri: Model, Graph\nusing OrdinaryDiffEq\nusing Plots\n\nusing Catlab.Theories\nusing Catlab.CategoricalAlgebra.FreeDiagrams\nusing Catlab.Graphics\n\ndisplay_wd(ex) = to_graphviz(ex, orientation=LeftToRight, labels=true);\nnothing #hide","category":"page"},{"location":"examples/covid/epidemiology/#SIR-Model:","page":"Basic Epidemiology Models","title":"SIR Model:","text":"","category":"section"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define model","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"sir = transmission ⋅ recovery","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"get resulting petri net as a C-Set","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"cset_sir = decoration(F_epi(sir));\ndisplay_wd(sir)","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"Use Petri.jl to visualize the C-Set","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"Graph(Model(cset_sir))","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define initial states and transition rates, then create, solve, and visualize ODE problem","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"u0 = [10.0, 1, 0];\np = [0.4, 0.4];\nnothing #hide","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"The C-Set representation has direct support for generating a DiffEq vector field","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"prob = ODEProblem(vectorfield(cset_sir),u0,(0.0,7.5),p);\nsol = solve(prob,Tsit5())\n\nplot(sol)","category":"page"},{"location":"examples/covid/epidemiology/#SEIR-Model:","page":"Basic Epidemiology Models","title":"SEIR Model:","text":"","category":"section"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define model","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"sei = exposure ⋅ (illness ⊗ id(I)) ⋅ ∇(I)\n\nseir = sei ⋅ recovery","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"here we convert the C-Set decoration to a Petri.jl model to use its StochasticDifferentialEquations support","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"p_seir = decoration(F_epi(seir));\n\ndisplay_wd(seir)","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"Graph(Model(p_seir))","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define initial states and transition rates, then create, solve, and visualize ODE problem","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"u0 = [10.0, 1, 0, 0];\np = [.9, .2, .5];\n\nprob = ODEProblem(vectorfield(p_seir),u0,(0.0,15.0),p);\nsol = solve(prob,Tsit5())\n\nplot(sol)","category":"page"},{"location":"examples/covid/epidemiology/#SEIRD-Model:","page":"Basic Epidemiology Models","title":"SEIRD Model:","text":"","category":"section"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define model","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"seird = sei ⋅ Δ(I) ⋅ (death ⊗ recovery)","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"get resulting petri net and visualize model","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"p_seird = decoration(F_epi(seird));\n\ndisplay_wd(seird)","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"Graph(Model(p_seird))","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"define initial states and transition rates, then create, solve, and visualize ODE problem","category":"page"},{"location":"examples/covid/epidemiology/","page":"Basic Epidemiology Models","title":"Basic Epidemiology Models","text":"u0 = [10.0, 1, 0, 0, 0];\np = [0.9, 0.2, 0.5, 0.1];\n\nprob = ODEProblem(vectorfield(p_seird),u0,(0.0,15.0),p);\nsol = solve(prob,Tsit5())\n\nplot(sol)","category":"page"},{"location":"examples/covid/chime/chime-cset/","page":"-","title":"-","text":"EditURL = \"https://github.com/AlgebraicJulia/AlgebraicPetri.jl/blob/master/examples/covid/chime/chime-cset.jl\"","category":"page"},{"location":"examples/covid/chime/chime-cset/","page":"-","title":"-","text":"using AlgebraicPetri\nusing Petri: Model, Graph\nusing OrdinaryDiffEq\nusing Plots\nusing Catlab.Meta\nusing JSON\n\nimport OrdinaryDiffEq: ODEProblem\nODEProblem(p::LabelledReactionNet, t) = ODEProblem(vectorfield(p), concentrations(p), t, rates(p))","category":"page"},{"location":"examples/covid/chime/chime-cset/","page":"-","title":"-","text":"help capture JSON of defined functions","category":"page"},{"location":"examples/covid/chime/chime-cset/","page":"-","title":"-","text":"macro capture(funcname, exname, ex)\n    quote\n        $(esc(exname)) = $(repr(strip_lines(ex, recurse=true)))\n        $(esc(funcname)) = $ex\n    end\nend\n\n@capture γ γ_text 1/14\n@capture β β_text t->begin\n    policy_days = [20,60,120] .+ 17\n    contact_rate = 0.05\n    pol = findfirst(x->t<=x, policy_days) # array of days when policy changes\n    growth_rate = pol == 1 ? 0.0 : (2^(1/((pol-1)*5)) - 1) # growth rate depending on policy\n    return (growth_rate + γ) / 990 * (1-contact_rate) # calculate rate of infection\nend\n\nsir_cset= LabelledReactionNet{Function, Float64}((:S=>990, :I=>10, :R=>0), (:inf, β)=>((:S, :I)=>(:I,:I)), (:rec, t->γ)=>(:I=>:R))\n\nGraph(Model(sir_cset))\n\nprob = ODEProblem(sir_cset, (17.0, 120.0))\nsol = OrdinaryDiffEq.solve(prob,Tsit5())\nplot(sol)\n\n# Getting Sharable JSON\nsir_cset_string = LabelledReactionNet{String, Int}((:S=>990, :I=>10, :R=>0), (:inf, β_text)=>((:S, :I)=>(:I,:I)), (:rec, γ_text)=>(:I=>:R))\nJSON.print(sir_cset_string.tables, 2)","category":"page"},{"location":"examples/covid/chime/chime/","page":"-","title":"-","text":"EditURL = \"https://github.com/AlgebraicJulia/AlgebraicPetri.jl/blob/master/examples/covid/chime/chime.jl\"","category":"page"},{"location":"examples/covid/chime/chime/","page":"-","title":"-","text":"using AlgebraicPetri\nusing AlgebraicPetri.Epidemiology\nusing Petri: Model, Graph\nusing OrdinaryDiffEq\nusing Plots\nusing Catlab.Theories\nusing Catlab.CategoricalAlgebra.FreeDiagrams\nusing Catlab.Graphics\n\ndisplay_wd(ex) = to_graphviz(ex, orientation=LeftToRight, labels=true);\n\nsir = transmission ⋅ recovery\n\np_sir = decoration(F_epi(sir));\ndisplay_wd(sir)","category":"page"},{"location":"examples/covid/chime/chime/","page":"-","title":"-","text":"Graph(Model(p_sir))\n\nu0 = [990.0, 10, 0];\nt_span = (17.0,120.0)\n\nγ = 1/14\nβ = t->begin\n    policy_days = [20,60,120] .+ 17\n    contact_rate = 0.05\n    pol = findfirst(x->t<=x, policy_days) # array of days when policy changes\n    growth_rate = pol == 1 ? 0.0 : (2^(1/((pol-1)*5)) - 1) # growth rate depending on policy\n    return (growth_rate + γ) / 990 * (1-contact_rate) # calculate rate of infection\nend\np = [β, γ];\n\nprob = ODEProblem(vectorfield(p_sir),u0,t_span,p)\nsol = OrdinaryDiffEq.solve(prob,Tsit5())\nplot(sol)\npng(\"ode-chime.png\")","category":"page"},{"location":"#AlgebraicPetri.jl","page":"AlgebraicPetri.jl","title":"AlgebraicPetri.jl","text":"","category":"section"},{"location":"","page":"AlgebraicPetri.jl","title":"AlgebraicPetri.jl","text":"CurrentModule = AlgebraicPetri","category":"page"},{"location":"","page":"AlgebraicPetri.jl","title":"AlgebraicPetri.jl","text":"AlgebraicPetri.jl is a Julia library for building Petri net agent based models compositionally. This library acts as a bridge between Catlab.jl and Petri.jl. This package defines the category of Open Petri Nets as described in [Baez 2018].","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"EditURL = \"https://github.com/AlgebraicJulia/AlgebraicPetri.jl/blob/master/examples/covid/covid.jl\"","category":"page"},{"location":"examples/covid/covid/#covid_example","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"","category":"section"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"(Image: )","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"using AlgebraicPetri\nusing AlgebraicPetri.Epidemiology\n\nusing Petri: Model, Graph\nusing OrdinaryDiffEq\nusing Plots\n\nusing Catlab\nusing Catlab.Theories\nusing Catlab.Programs\nusing Catlab.CategoricalAlgebra.FreeDiagrams\nusing Catlab.WiringDiagrams\nusing Catlab.Graphics\n\nimport Catlab.Theories: id\n\ndisplay_wd(ex) = to_graphviz(ex, orientation=LeftToRight, labels=true);\nid(args...) = foldl((x,y)->id(x) ⊗ id(y), args);\nnothing #hide","category":"page"},{"location":"examples/covid/covid/#Step-1:-Define-a-new-primitive-to-extend-the-presentation-of-InfectiousDiseases","page":"Multi-City COVID-19 Model","title":"Step 1: Define a new primitive to extend the presentation of InfectiousDiseases","text":"","category":"section"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"travel_petri = PetriCospan(\n        [1,2,3],\n        PetriNet(6, (1,4), (2,5), (3,6)),\n        [4,5,6]);\nnothing #hide","category":"page"},{"location":"examples/covid/covid/#Step-2:-Extend-the-Infectious-Disease-presentation,","page":"Multi-City COVID-19 Model","title":"Step 2: Extend the Infectious Disease presentation,","text":"","category":"section"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"get the new generators, and update the functor","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"@present EpiWithTravel <: InfectiousDiseases begin\n    travel::Hom(S⊗E⊗I,S⊗E⊗I)\nend;\n\nS,E,I,R,D,transmission,exposure,illness,recovery,death,travel = generators(EpiWithTravel);\nnew_functor = copy(FunctorGenerators)\nnew_functor[travel] = travel_petri\n\nF(ex) = functor((PetriCospanOb, PetriCospan), ex, generators=new_functor);\nnothing #hide","category":"page"},{"location":"examples/covid/covid/#COVID-19-TRAVEL-MODEL:","page":"Multi-City COVID-19 Model","title":"COVID-19 TRAVEL MODEL:","text":"","category":"section"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"SEIRD City Model with travel as S ⊗ E ⊗ I → S ⊗ E ⊗ I","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"seird_city = (((Δ(S)  id(E))  (id(S)  σ(SE)))  id(I))  (id(S E)  exposure) \n                (id(S)  ((E)  Δ(E))  id(I))  (id(S E)  ((illness  id(I)) \n                ((I)  Δ(I))  (id(I)  (Δ(I) (recovery  death)))))  (travel  (R)  (D))","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"This is a very complicated interaction, so we can use the program interface for easier model definition","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"seird_city = @program EpiWithTravel (s::S, e::E, i::I) begin\n    e2, i2 = exposure(s, i)\n    i3 = illness(e2)\n    d = death(i3)\n    r = recovery(i3)\n    return travel(s, [e, e2], [i2, i3])\nend\nseird_city = to_hom_expr(FreeBiproductCategory, seird_city)\n\ndisplay_wd(seird_city)","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Graph(Model(decoration(F(seird_city))))","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"create a multi-city SEIRD models","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"ncities(city,n::Int) = compose([city for i in 1:n]...)\n\nseird_3 = ncities(seird_city, 3)\npc_seird_3 = F(seird_3)\np_seird_3 = decoration(pc_seird_3)\ndisplay_wd(seird_3)","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Graph(Model(p_seird_3))","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Define time frame and initial parameters","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"tspan = (0.0,90.0)\nu0 = zeros(Float64, length(base(pc_seird_3)))\nu0[1]  = 10000\nu0[6]  = 10000\nu0[11] = 10000\nu0[2]  = 1\n\nseirdparams(n::Int, k::Number) = begin\n    βseird = [10/sum(u0), 1/2, 1/5, 1/16]\n    βtravel = [1/20, 1/200, 1/20]/100k\n    β = vcat(βseird, βtravel)\n    return foldl(vcat, [(1-(0/(2n)))*β for i in 1:n])\nend\nparams = seirdparams(3, 5);\nnothing #hide","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Generate, solve, and visualize resulting ODE","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"prob = ODEProblem(vectorfield(p_seird_3),u0,tspan,params);\nsol = solve(prob,Tsit5());\n\nplot(sol)","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Define different dynamic transition function rates","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"asymptotic(a,b,k=1) = t->(b + (a-b)/(k*t+1))\ntriangleasm(a,b,k=1) = t->max(b, (1-t/k)*(a-b)+b)\ntrianglewave(a,b,k=1) = t->((a-b)/π)*asin(sin(t*2π/k))+2b\ncoswave(a,b,k=1) = t->(a-b)*(cos(t*2π/k)/2)+( a+b )/2\nsincwave(a,b,k=1) = t->(a-b)*(sinc(t*2π/k)/2)+( a+b )/2\nmodsincwave(a,b,k) = t-> max(b, (a-b)*(sinc(t*2π/k))+(b))\ndynseirdparams(f, a,b,period, n::Int, scale::Number) = begin\n    βseird = [f(a,b,period), 1/2, 1/5, 1/16]\n    βtravel = [1/20, 1/200, 1/20]/100scale\n    β = vcat(βseird, βtravel)\n    return foldl(vcat, [β for i in 1:n])\nend\n\nwaveparams(f,a,b,p) = begin\n    dynseirdparams(f,a,b,p,3,5)\nend;\nnothing #hide","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"Generate, solve, and visualize ODE of a dynamic flow rates","category":"page"},{"location":"examples/covid/covid/","page":"Multi-City COVID-19 Model","title":"Multi-City COVID-19 Model","text":"tspan = (0, 240.0)\na,b,p = 10, 1, 1/6\n\ndynparams = waveparams(asymptotic, a/sum(u0), b/sum(u0),p)\n\nprob = ODEProblem(vectorfield(p_seird_3),u0,tspan, dynparams)\nsol = solve(prob,Tsit5(), saveat=1:1:tspan[2])\n\nplot(sol)","category":"page"}]
}
