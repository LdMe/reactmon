import Trainer from "./Trainer";

const Trainers = ({ trainers,onSelect,onDelete }) => {

    return (
        <div className="trainer-show">
            <h2>Entrenadores</h2>
            <section className="trainers-list">
            {trainers?.map((trainer) => <Trainer key={trainer._id} trainer={trainer} onDelete={onDelete} onSelect={onSelect}/>)}
            </section>
        </div>
    )
}

export default Trainers