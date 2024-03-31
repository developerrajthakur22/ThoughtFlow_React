import styles from "./EditForm.module.css"

const Categories = ({handleFormData}) => {

    return <div className={styles.formFields}>
        <label className={styles.label}>Categories:</label>
        <div className={styles.categoryCheckboxes}>
            {[
                "TECHNICAL",
                "TRAVEL",
                "FOOD",
                "SPORTS",
                "LIFESTYLE",
                "MOVIES",
                "POLITICS",
                "NEWS",
                "SPACE",
                "OTHER"
            ].map(category => (
                <div className={styles.checkboxWrapper} key={category}>
                    <input
                        type="checkbox"
                        name="categories"
                        value={category}
                        onChange={handleFormData}
                    />
                    <label>{category}</label>
                </div>
            ))}
        </div>
    </div>


}

export default Categories;